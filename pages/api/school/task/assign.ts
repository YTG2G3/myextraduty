import AuthRoute from "@/lib/auth-route";
import { assignMember, listUserAssignments, getSchool, getTask, listTaskAssignments } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { task, user } = JSON.parse(req.body);
        let s = await getSchool(client, Number(req.headers.school));
        let t = await getTask(client, task);
        let a = await listTaskAssignments(client, task);

        // Make sure it's not full
        if (a.length >= t.capacity) return res.status(400).end();

        // Make sure it's not overlapping
        if (a.find(v => v.email === user)) return res.status(400).end();

        let e = await listUserAssignments(client, s.id, user);

        // Make sure we're not going over limit
        if (e.length >= s.max_assigned) return res.status(400).end();

        let r = await assignMember(client, task, user, s.id);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }