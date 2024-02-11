import { useSession } from 'next-auth/react';
import AuthSession from './auth-session';

export default function useClientSession() {
  let { data: session } = useSession();
  let _session: AuthSession = session as AuthSession;

  return _session;
}
