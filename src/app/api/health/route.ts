export const dynamic = 'force-dynamic'; // defaults to auto
export const revalidate = 0;

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(_request: Request) {
  return Response.json({ status: 'OK' });
}
