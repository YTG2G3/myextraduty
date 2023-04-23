import AuthRoute from "@/lib/auth-route";
import { getEnrollments } from "@/lib/db";
import { User } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, user: User) => {
        let er = await getEnrollments(user.email);
        res.json(er);
    }
});

export const config = { api: { externalResolver: true, } }