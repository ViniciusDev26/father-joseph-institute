import { randomUUID } from 'node:crypto';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { artisans, productArtisans, productPhotos, products } from '../database/schema';
import { generatePresignedPutUrl, getPublicUrl } from '../lib/storage';
import {
  createProductBodySchema,
  createProductResponseSchema,
  listProductsResponseSchema,
} from '../schemas/product';
import { errorResponseSchema } from '../schemas/shared';
import type { CreateProductBody } from '../types/product';

export async function productRoutes(app: FastifyInstance) {
  const listProductsSchema = {
    description: 'List all products in the catalog',
    tags: ['Products'],
    response: {
      200: listProductsResponseSchema,
    },
  };

  const createProductSchema = {
    description: 'Register a new product in the catalog',
    tags: ['Products'],
    body: createProductBodySchema,
    response: {
      201: createProductResponseSchema,
      400: errorResponseSchema,
      422: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/products', { schema: listProductsSchema }, listProducts)
    .post('/products', { schema: createProductSchema }, createProduct);
}

async function listProducts(_request: FastifyRequest, reply: FastifyReply) {
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
    .leftJoin(productPhotos, and(eq(productPhotos.productId, products.id), isNull(productPhotos.deletedAt)))
    .where(isNull(products.deletedAt));

  const artisanRows = await db
    .select({
      productId: productArtisans.productId,
      artisanId: artisans.id,
      artisanName: artisans.name,
    })
    .from(productArtisans)
    .innerJoin(artisans, eq(artisans.id, productArtisans.artisanId))
    .where(inArray(productArtisans.productId, photoRows.map((r) => r.productId)));

  const artisansByProduct = new Map<number, { id: number; name: string }[]>();
  for (const row of artisanRows) {
    const list = artisansByProduct.get(row.productId) ?? [];
    list.push({ id: row.artisanId, name: row.artisanName });
    artisansByProduct.set(row.productId, list);
  }

  const productsMap = new Map<
    number,
    {
      id: number;
      name: string;
      description: string | null;
      price: number;
      photos: { id: number; url: string }[];
      artisans: { id: number; name: string }[];
    }
  >();

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
      productsMap.get(row.productId)!.photos.push({
        id: row.photoId,
        url: getPublicUrl(row.photoObjectKey),
      });
    }
  }

  return reply.status(200).send({ products: [...productsMap.values()] });
}

async function createProduct(
  request: FastifyRequest<{ Body: CreateProductBody }>,
  reply: FastifyReply,
) {
  const { name, description, price, artisanIds, photos } = request.body;

  const uniqueArtisanIds = [...new Set(artisanIds)];

  const foundArtisans = await db
    .select({ id: artisans.id, name: artisans.name })
    .from(artisans)
    .where(and(inArray(artisans.id, uniqueArtisanIds), isNull(artisans.deletedAt)));

  if (foundArtisans.length !== uniqueArtisanIds.length) {
    return reply.status(422).send({
      statusCode: 422,
      code: 'ARTISAN_NOT_FOUND',
      error: 'Unprocessable Entity',
      message: 'One or more artisan IDs not found',
    });
  }

  const [product] = await db
    .insert(products)
    .values({ name, description: description ?? null, price: String(price) })
    .returning();

  await db.insert(productArtisans).values(
    uniqueArtisanIds.map((artisanId) => ({ productId: product.id, artisanId })),
  );

  const photosResult = await Promise.all(
    photos.map(async (photo) => {
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

  return reply.status(201).send({
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    photos: photosResult,
    artisans: foundArtisans,
  });
}
