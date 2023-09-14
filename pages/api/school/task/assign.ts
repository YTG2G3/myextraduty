import AuthRoute from "@/lib/auth-route";
import { assignMember, listUserAssignments, getSchool, getTask, listAttendants } from "@/lib/db";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { task, user } = JSON.parse(req.body);
        let s = await getSchool(Number(req.headers.school));
        let t = await getTask(task);
        let a = await listAttendants(task);

        // Can't sign up for completed events
        if (dayjs().isAfter(dayjs(t.ending_date + " " + t.ending_time))) return res.status(400).end();

        // Make sure it's not full
        if (a.length >= t.capacity) return res.status(400).end();

        // Make sure it's not overlapping
        if (a.find(v => v.email === user)) return res.status(400).end();

        let e = await listUserAssignments(s.id, user);

        // Make sure we're not going over limit
        if (e.length >= s.max_assigned) return res.status(400).end();

        let r = await assignMember(task, user, s.id);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }