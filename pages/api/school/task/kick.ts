import AuthRoute from "@/lib/auth-route";
import { removeMemberFromTask } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { task, user } = JSON.parse(req.body);
        let r = await removeMemberFromTask(client, task, user);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }