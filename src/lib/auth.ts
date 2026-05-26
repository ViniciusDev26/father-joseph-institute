import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import { errorResponse } from './api-handler';
import { env } from './env';

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, env.ADMIN_BASIC_AUTH_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return value === env.ADMIN_BASIC_AUTH_TOKEN;
}

export function validateBasicCredentials(authHeader: string | null | undefined): boolean {
  if (!authHeader?.startsWith('Basic ')) return false;
  const [, base64] = authHeader.split(' ');
  if (!base64) return false;
  const credentials = Buffer.from(base64, 'base64').toString('ascii');
  return credentials === env.ADMIN_BASIC_AUTH_TOKEN;
}

type GuardResult = { ok: true } | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<GuardResult> {
  if (await isAdminAuthenticated()) return { ok: true };
  return { ok: false, response: errorResponse(401, 'UNAUTHORIZED', 'Authentication required') };
}
