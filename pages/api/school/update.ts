import AuthRoute from "@/lib/auth-route";
import { updateSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { school } = req.headers;
        let { address, primary_color, logo, opening_at, quota, max_assigned, drop_enabled, timezone } = JSON.parse(req.body);
        let r = await updateSchool(client, Number(school), address, primary_color, logo, opening_at, quota, max_assigned, drop_enabled, timezone);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }