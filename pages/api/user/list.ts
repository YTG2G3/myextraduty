import AuthRoute from "@/lib/auth-route";
import { listUsers } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let l = await listUsers(client);
        res.json(l);
    }
}, true);

export const config = { api: { externalResolver: true, } }