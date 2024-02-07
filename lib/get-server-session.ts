import authOptions from "./auth-options";
import AuthSession from "./auth-session";
import { getServerSession as _getServerSession } from 'next-auth';

export default async function getServerSession() {
    let session = await _getServerSession(authOptions);
    let _session: AuthSession = session as AuthSession;

    return _session;
}