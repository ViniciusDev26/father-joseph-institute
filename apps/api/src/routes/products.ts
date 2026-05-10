import { randomUUID } from 'node:crypto';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../database/connection';
import { artisans, productArtisans, productPhotos, products } from '../database/schema';
import { generatePresignedPutUrl, getPublicUrl } from '../lib/storage';
import {
  createProductBodySchema,
  createProductResponseSchema,
  getProductResponseSchema,
  listProductsResponseSchema,
  productParamsSchema,
  updateProductBodySchema,
  updateProductResponseSchema,
} from '../schemas/product';
import { errorResponseSchema } from '../schemas/shared';
import type { CreateProductBody, ProductParams, UpdateProductBody } from '../types/product';

export async function productRoutes(app: FastifyInstance) {
  const listProductsSchema = {
    description: 'List all products in the catalog',
    tags: ['Products'],
    response: {
      200: listProductsResponseSchema,
    },
  };

  const getProductSchema = {
    description: 'Get a single product by ID',
    tags: ['Products'],
    params: productParamsSchema,
    response: {
      200: getProductResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
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

  const updateProductSchema = {
    description: 'Update a product',
    tags: ['Products'],
    params: productParamsSchema,
    body: updateProductBodySchema,
    response: {
      200: updateProductResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
      422: errorResponseSchema,
    },
  };

  const deleteProductSchema = {
    description: 'Soft-delete a product',
    tags: ['Products'],
    params: productParamsSchema,
    response: {
      204: z.null(),
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/products', { schema: listProductsSchema }, listProducts)
    .get('/products/:id', { schema: getProductSchema, preHandler: [app.authenticate] }, getProduct)
    .post(
      '/products',
      {
        schema: createProductSchema,
        preHandler: [app.authenticate],
      },
      createProduct,
    )
    .patch(
      '/products/:id',
      { schema: updateProductSchema, preHandler: [app.authenticate] },
      updateProduct,
    )
    .delete(
      '/products/:id',
      { schema: deleteProductSchema, preHandler: [app.authenticate] },
      deleteProduct,
    );
}

async function loadProductWithRelations(productId: number) {
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
    .leftJoin(
      productPhotos,
      and(eq(productPhotos.productId, products.id), isNull(productPhotos.deletedAt)),
    )
    .where(isNull(products.deletedAt));

  const artisanRows = await db
    .select({
      productId: productArtisans.productId,
      artisanId: artisans.id,
      artisanName: artisans.name,
    })
    .from(productArtisans)
    .innerJoin(artisans, eq(artisans.id, productArtisans.artisanId))
    .where(
      and(
        inArray(
          productArtisans.productId,
          photoRows.map(r => r.productId),
        ),
        isNull(artisans.deletedAt),
      ),
    );

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

async function getProduct(request: FastifyRequest<{ Params: ProductParams }>, reply: FastifyReply) {
  const product = await loadProductWithRelations(request.params.id);

  if (!product) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'PRODUCT_NOT_FOUND',
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  return reply.status(200).send(product);
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

  await db
    .insert(productArtisans)
    .values(uniqueArtisanIds.map(artisanId => ({ productId: product.id, artisanId })));

  const photosResult = await Promise.all(
    photos.map(async photo => {
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

async function updateProduct(
  request: FastifyRequest<{ Params: ProductParams; Body: UpdateProductBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { name, description, price, artisanIds } = request.body;

  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .limit(1);

  if (!existing) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'PRODUCT_NOT_FOUND',
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  if (artisanIds !== undefined) {
    const uniqueArtisanIds = [...new Set(artisanIds)];
    const foundArtisans = await db
      .select({ id: artisans.id })
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
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = String(price);

  await db
    .update(products)
    .set(updates)
    .where(and(eq(products.id, id), isNull(products.deletedAt)));

  const product = await loadProductWithRelations(id);
  if (!product) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'PRODUCT_NOT_FOUND',
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  return reply.status(200).send(product);
}

async function deleteProduct(
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const [deleted] = await db
    .update(products)
    .set({ deletedAt: new Date() })
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .returning({ id: products.id });

  if (!deleted) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'PRODUCT_NOT_FOUND',
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  return reply.status(204).send();
}
