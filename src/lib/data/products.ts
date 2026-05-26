import { randomUUID } from 'node:crypto';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { artisans, productArtisans, productPhotos, products } from '@/db/schema';
import { generatePresignedPutUrl, getPublicUrl } from '@/lib/storage';
import type { Product } from '@/types/content';

export async function getProducts(): Promise<Product[]> {
  const photoRows = await db
    .select({
      productId: products.id,
      productName: products.name,
      productDescription: products.description,
      productPrice: products.price,
      photoId: productPhotos.id,
      photoObjectKey: productPhotos.objectKey,
    })
    .from(products)
    .leftJoin(
      productPhotos,
      and(eq(productPhotos.productId, products.id), isNull(productPhotos.deletedAt)),
    )
    .where(isNull(products.deletedAt));

  if (photoRows.length === 0) return [];

  const productIds = [...new Set(photoRows.map(r => r.productId))];

  const artisanRows = await db
    .select({
      productId: productArtisans.productId,
      artisanId: artisans.id,
      artisanName: artisans.name,
    })
    .from(productArtisans)
    .innerJoin(artisans, eq(artisans.id, productArtisans.artisanId))
    .where(and(inArray(productArtisans.productId, productIds), isNull(artisans.deletedAt)));

  const artisansByProduct = new Map<number, { id: number; name: string }[]>();
  for (const row of artisanRows) {
    const list = artisansByProduct.get(row.productId) ?? [];
    list.push({ id: row.artisanId, name: row.artisanName });
    artisansByProduct.set(row.productId, list);
  }

  const productsMap = new Map<number, Product>();

  for (const row of photoRows) {
    if (!productsMap.has(row.productId)) {
      productsMap.set(row.productId, {
        id: row.productId,
        name: row.productName,
        description: row.productDescription,
        price: parseFloat(row.productPrice),
        photos: [],
        artisans: artisansByProduct.get(row.productId) ?? [],
      });
    }
    if (row.photoId && row.photoObjectKey) {
      // biome-ignore lint/style/noNonNullAssertion: just inserted above
      productsMap.get(row.productId)!.photos.push({
        id: row.photoId,
        url: getPublicUrl(row.photoObjectKey),
      });
    }
  }

  return [...productsMap.values()];
}

export async function getProductById(productId: number): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product) return null;

  const photoRows = await db
    .select({ id: productPhotos.id, objectKey: productPhotos.objectKey })
    .from(productPhotos)
    .where(and(eq(productPhotos.productId, product.id), isNull(productPhotos.deletedAt)));

  const artisanRows = await db
    .select({ id: artisans.id, name: artisans.name })
    .from(productArtisans)
    .innerJoin(artisans, eq(artisans.id, productArtisans.artisanId))
    .where(and(eq(productArtisans.productId, product.id), isNull(artisans.deletedAt)));

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    photos: photoRows.map(p => ({ id: p.id, url: getPublicUrl(p.objectKey) })),
    artisans: artisanRows,
  };
}

export type CreatedProductPhoto = { id: number; url: string; presignedUrl: string };

export type CreateProductInput = {
  name: string;
  description?: string | null;
  price: number;
  artisanIds: number[];
  photos: { mimeType: 'image/png' | 'image/jpeg' }[];
};

export type CreatedProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  photos: CreatedProductPhoto[];
  artisans: { id: number; name: string }[];
};

export type CreateProductResult =
  | { ok: true; product: CreatedProduct }
  | { ok: false; code: 'ARTISAN_NOT_FOUND'; message: string };

export async function createProduct(input: CreateProductInput): Promise<CreateProductResult> {
  const uniqueArtisanIds = [...new Set(input.artisanIds)];

  const foundArtisans = await db
    .select({ id: artisans.id, name: artisans.name })
    .from(artisans)
    .where(and(inArray(artisans.id, uniqueArtisanIds), isNull(artisans.deletedAt)));

  if (foundArtisans.length !== uniqueArtisanIds.length) {
    return { ok: false, code: 'ARTISAN_NOT_FOUND', message: 'One or more artisan IDs not found' };
  }

  const [product] = await db
    .insert(products)
    .values({
      name: input.name,
      description: input.description ?? null,
      price: String(input.price),
    })
    .returning();

  await db
    .insert(productArtisans)
    .values(uniqueArtisanIds.map(artisanId => ({ productId: product.id, artisanId })));

  const photos = await Promise.all(
    input.photos.map(async photo => {
      const ext = photo.mimeType === 'image/png' ? 'png' : 'jpg';
      const objectKey = `products/${product.id}/${randomUUID()}.${ext}`;
      const [inserted] = await db
        .insert(productPhotos)
        .values({ productId: product.id, objectKey, mimeType: photo.mimeType })
        .returning();
      const presignedUrl = await generatePresignedPutUrl(objectKey, photo.mimeType);
      return { id: inserted.id, url: getPublicUrl(objectKey), presignedUrl };
    }),
  );

  return {
    ok: true,
    product: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      photos,
      artisans: foundArtisans,
    },
  };
}

export type UpdateProductInput = {
  name?: string;
  description?: string | null;
  price?: number;
  artisanIds?: number[];
};

export type UpdateProductResult =
  | { ok: true; product: Product }
  | { ok: false; code: 'PRODUCT_NOT_FOUND' | 'ARTISAN_NOT_FOUND'; message: string };

export async function updateProduct(
  id: number,
  patch: UpdateProductInput,
): Promise<UpdateProductResult> {
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .limit(1);

  if (!existing) {
    return { ok: false, code: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  }

  if (patch.artisanIds !== undefined) {
    const uniqueArtisanIds = [...new Set(patch.artisanIds)];
    const foundArtisans = await db
      .select({ id: artisans.id })
      .from(artisans)
      .where(and(inArray(artisans.id, uniqueArtisanIds), isNull(artisans.deletedAt)));

    if (foundArtisans.length !== uniqueArtisanIds.length) {
      return { ok: false, code: 'ARTISAN_NOT_FOUND', message: 'One or more artisan IDs not found' };
    }

    await db.delete(productArtisans).where(eq(productArtisans.productId, id));
    await db
      .insert(productArtisans)
      .values(uniqueArtisanIds.map(artisanId => ({ productId: id, artisanId })));
  }

  const updates: {
    name?: string;
    description?: string | null;
    price?: string;
    updatedAt: Date;
  } = { updatedAt: new Date() };
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.price !== undefined) updates.price = String(patch.price);

  await db
    .update(products)
    .set(updates)
    .where(and(eq(products.id, id), isNull(products.deletedAt)));

  const product = await getProductById(id);
  if (!product) {
    return { ok: false, code: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  }

  return { ok: true, product };
}

export async function softDeleteProduct(id: number): Promise<boolean> {
  const [deleted] = await db
    .update(products)
    .set({ deletedAt: new Date() })
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .returning({ id: products.id });
  return !!deleted;
}
