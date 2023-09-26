import AuthRoute from "@/lib/auth-route";
import { promoteUser } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let r = await promoteUser(client, req.body);
        res.status(r ? 200 : 400).end();
    }
}, true);

export const config = { api: { externalResolver: true, } }