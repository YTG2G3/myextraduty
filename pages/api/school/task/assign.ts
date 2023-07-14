import AuthRoute from "@/lib/auth-route";
import { assignMember, getTask, listAttendants } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { task, user } = JSON.parse(req.body);

        // Make sure it's not full
        let a = await listAttendants(task);
        let t = await getTask(task);

        if (a.length >= t.capacity) return res.status(400);

        let r = await assignMember(task, user);

        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }