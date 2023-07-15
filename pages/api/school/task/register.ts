import AuthRoute from "@/lib/auth-route";
import { assignMember, getAssignedTasks, getSchool, getTask, listAttendants } from "@/lib/db";
import { User } from "@/lib/schema";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, user: User) => {
        let { task } = JSON.parse(req.body);

        let a = await listAttendants(task);
        let t = await getTask(task);

        // Can't sign up for completed events
        // TODO - potential timezone error on production server; consider
        if (dayjs().isAfter(dayjs(t.ending_date + " " + t.ending_time))) return res.status(400);

        // Make sure it's not full
        if (a.length >= t.capacity) return res.status(400);

        // Make sure it's not overlapping
        if (a.find(v => v.user.email === user.email)) return res.status(400);

        let e = await getAssignedTasks(Number(req.headers.school), user.email);
        let s = await getSchool(Number(req.headers.school));

        // Make sure we're not going over limit
        if (e.length >= s.max_assigned) return res.status(400);

        let r = await assignMember(task, user.email, Number(req.headers.school));

        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }