import AuthRoute from "@/lib/auth-route";
import { getEnrollments } from "@/lib/db";
import { Profile } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, user: Profile) => {
        let { email } = req.query;

        if (!email) {
            let er = await getEnrollments(user.email as string);
            return res.json(er);
        }

        if (user.admin || user.email == email) {
            let er = await getEnrollments(email as string);
            return res.json(er);
        }

        res.status(401).end();
    }
});

export const config = { api: { externalResolver: true, } }