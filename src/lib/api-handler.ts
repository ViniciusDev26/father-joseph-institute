import { NextResponse } from 'next/server';
import type { ZodType } from 'zod/v4';

const errorByStatus: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
};

export function errorResponse(statusCode: number, code: string, message: string) {
  return NextResponse.json(
    {
      statusCode,
      code,
      error: errorByStatus[statusCode] ?? 'Error',
      message,
    },
    { status: statusCode },
  );
}

type ParseResult<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

function fail(message: string): ParseResult<never> {
  return { ok: false, response: errorResponse(400, 'VALIDATION_ERROR', message) };
}

export async function parseJsonBody<T>(req: Request, schema: ZodType<T>): Promise<ParseResult<T>> {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return fail('Request body must be valid JSON');
  }
  const result = schema.safeParse(payload);
  if (!result.success) return fail(result.error.message);
  return { ok: true, data: result.data };
}

export function parseParams<T>(params: unknown, schema: ZodType<T>): ParseResult<T> {
  const result = schema.safeParse(params);
  if (!result.success) return fail(result.error.message);
  return { ok: true, data: result.data };
}

export function parseSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodType<T>,
): ParseResult<T> {
  const obj: Record<string, string> = {};
  for (const [k, v] of searchParams.entries()) obj[k] = v;
  const result = schema.safeParse(obj);
  if (!result.success) return fail(result.error.message);
  return { ok: true, data: result.data };
}
