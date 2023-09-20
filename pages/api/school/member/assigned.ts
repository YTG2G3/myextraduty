import AuthRoute from "@/lib/auth-route";
import { getTask, listUserAssignments } from "@/lib/db";
import { Task } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { email } = req.query;

        let a = await listUserAssignments(client, Number(req.headers.school), String(email));
        let s: Task[] = [];

        for (let x of a) {
            let l = await getTask(client, x.task);
            s.push(l);
        }

        res.json(s);
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }