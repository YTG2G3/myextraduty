import { Session, getServerSession } from "next-auth";
import authOptions from "./auth-options";

type AuthSession = Session & {
    user: {
        id: string;
        admin: boolean;
    };
}

export default async function authSession() {
    let session = await getServerSession(authOptions);
    let _session: AuthSession = session as AuthSession;

    return _session;
}