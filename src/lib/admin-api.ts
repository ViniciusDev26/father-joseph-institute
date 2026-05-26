'use client';

type ApiOk<T> = { data: T; status: number };

class AdminApiError extends Error {
  constructor(
    public status: number,
    public data: { message?: string; code?: string } | null,
  ) {
    super(data?.message ?? `HTTP ${status}`);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<ApiOk<T>> {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new AdminApiError(res.status, data);
  }

  if (res.status === 204) {
    return { data: null as T, status: res.status };
  }

  return { data: (await res.json()) as T, status: res.status };
}

// biome-ignore lint/suspicious/noExplicitAny: matches axios default for incremental migration
type AnyResponse = any;

export const api = {
  get: <T = AnyResponse>(path: string) => request<T>('GET', path),
  post: <T = AnyResponse>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T = AnyResponse>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  put: <T = AnyResponse>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T = AnyResponse>(path: string) => request<T>('DELETE', path),
};

export function isApiError(err: unknown): err is AdminApiError {
  return err instanceof AdminApiError;
}
