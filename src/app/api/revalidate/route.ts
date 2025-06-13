import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  // Use the AUTH_CLIENT_SECRET to revalidate the page for testing purposes
  if (token && token === process.env.AUTH_CLIENT_SECRET) {
    revalidatePath('/', 'layout');
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing or invalid token',
  });
}
