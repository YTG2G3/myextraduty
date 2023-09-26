import AuthRoute from "@/lib/auth-route";
import { getSchool, listTasks } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let s = await getSchool(client, Number(req.headers.school));
        let x = await listTasks(client, s.id);

        res.json(x);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }