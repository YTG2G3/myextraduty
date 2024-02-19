import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthSession from './auth-session';

export default function useClientSession(checkAuth = true) {
  let router = useRouter();

  let { data: session } = useSession();
  if (checkAuth && !session) router.push('/login');

  let _session: AuthSession = session as AuthSession;
  return _session;
}
