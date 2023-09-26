import AuthRoute from "@/lib/auth-route";
import { listUserEnrollments } from "@/lib/db";
import { Profile } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        let { email } = req.query;

        if (!email) {
            let er = await listUserEnrollments(client, user.email as string);
            return res.json(er);
        }

        if (user.admin || user.email == email) {
            let er = await listUserEnrollments(client, email as string);
            return res.json(er);
        }

        res.status(401).end();
    }
});

export const config = { api: { externalResolver: true, } }