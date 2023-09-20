import AuthRoute from "@/lib/auth-route";
import { clearMembers, getSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let s = await getSchool(client, Number(req.headers.school));
        let x = await clearMembers(client, s.id, s.owner);

        return res.status(x ? 200 : 400).end();
    }
}, false, true, true);

export const config = { api: { externalResolver: true, } }