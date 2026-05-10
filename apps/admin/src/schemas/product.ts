import { z } from 'zod';

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  photos: z.array(z.object({ id: z.number(), url: z.string() })),
  artisans: z.array(z.object({ id: z.number(), name: z.string() })),
});

export const listProductsResponseSchema = z.object({
  products: z.array(productSchema),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser maior que zero'),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProductForm = z.infer<typeof createProductSchema>;
export type UpdateProductForm = z.infer<typeof updateProductSchema>;
