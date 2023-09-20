import AuthRoute from "@/lib/auth-route";
import { promoteMember } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { email } = JSON.parse(req.body);
        let s = await promoteMember(client, Number(req.headers.school), email);

        res.status(s ? 200 : 400).end();
    }
}, false, true, true);

export const config = { api: { externalResolver: true, } }