import AuthRoute from "@/lib/auth-route";
import { createSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { name, owner, address, primary_color, logo } = JSON.parse(req.body);
        let r = await createSchool(client, name, owner, address, primary_color, logo);

        res.status(r ? 200 : 400).end();
    }
}, true);

export const config = { api: { externalResolver: true, } }