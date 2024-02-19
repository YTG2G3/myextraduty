import { NextRequest, NextResponse } from 'next/server';
import AuthSession from './auth-session';
import getServerSession from './get-server-session';

export default async function authRoute(
  route: (session: AuthSession) => Promise<NextResponse>
) {
  let session = await getServerSession(false);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return await route(session);
}
