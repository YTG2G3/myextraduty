import { Session } from "next-auth";

type AuthSession = Session & {
    user: {
        id: string;
        admin: boolean;
    };
}

export default AuthSession;