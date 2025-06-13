import { type NextRequest, NextResponse } from 'next/server';

import { FORWARDED_FOR_HEADER } from '@common/constants/headers.mjs';
import { getSentryDsn } from '@common/env/runtime';
import { forwardToSentry } from '@common/sentry/tunnel';

const sentryDsn = getSentryDsn();
const sentryDsnUrl = sentryDsn ? new URL(sentryDsn) : null;

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

export async function POST(req: NextRequest) {
  if (!sentryDsnUrl) {
    return NextResponse.json({ error: 'Sentry disabled' }, { status: 500 });
  }
  if (!req.body) {
    return NextResponse.json({ error: 'No request body' }, { status: 500 });
  }
  const clientIp = req.headers.get(FORWARDED_FOR_HEADER)!;

  try {
    await forwardToSentry(await req.text(), sentryDsnUrl, clientIp);
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to forward to Sentry' }, { status: 500 });
  }
  return NextResponse.json({}, { status: 200 });
}
