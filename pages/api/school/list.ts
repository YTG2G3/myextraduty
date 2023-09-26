import AuthRoute from "@/lib/auth-route";
import { listSchools } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let s = await listSchools(client);
        res.json(s);
    }
}, true);

export const config = { api: { externalResolver: true, } }