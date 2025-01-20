export const dynamic = 'force-dynamic'; // defaults to auto
export const revalidate = 0;

export async function GET(request: Request) {
  return Response.json({ status: 'OK' });
}
