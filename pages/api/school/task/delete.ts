import AuthRoute from "@/lib/auth-route";
import { deleteTask } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { task } = JSON.parse(req.body);

        let r = await deleteTask(client, task);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }