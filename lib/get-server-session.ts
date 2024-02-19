import { getServerSession as _getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from './auth-options';
import AuthSession from './auth-session';

export default async function getServerSession(checkAuth = true) {
  let session = await _getServerSession(authOptions);
  if (checkAuth && !session) redirect('/login');

  let _session: AuthSession = session as AuthSession;
  return _session;
}
