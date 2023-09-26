import AuthRoute from "@/lib/auth-route";
import { getUser, listTaskAssignments } from "@/lib/db";
import { Attendant } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { task } = req.query;
        let a: Attendant[] = [];
        let s = await listTaskAssignments(client, Number(task));

        for (let i of s) {
            let x = await getUser(client, i.email);
            a.push({ ...x, assigned_at: i.assigned_at });
        }

        res.json(a);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }