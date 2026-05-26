import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/api-handler';
import { setAdminSession, validateBasicCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!validateBasicCredentials(authHeader)) {
    return errorResponse(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }

  await setAdminSession();

  return NextResponse.json({ ok: true });
}
