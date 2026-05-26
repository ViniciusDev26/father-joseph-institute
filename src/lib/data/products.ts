import { and, eq, inArray, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { artisans, productArtisans, productPhotos, products } from '@/db/schema';
import { getPublicUrl } from '@/lib/storage';
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
