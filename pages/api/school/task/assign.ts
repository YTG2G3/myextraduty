import AuthRoute from "@/lib/auth-route";
import { assignMember, listUserAssignments, getSchool, getTask, listAttendants } from "@/lib/db";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { task, user } = JSON.parse(req.body);

        let a = await listAttendants(task);
        let t = await getTask(task);

        // Can't sign up for completed events
        // TODO - potential timezone error on production server; consider
        if (dayjs().isAfter(dayjs(t.ending_date + " " + t.ending_time))) return res.status(400).end();

        // Make sure it's not full
        if (a.length >= t.capacity) return res.status(400).end();

        // Make sure it's not overlapping
        if (a.find(v => v.user.email === user)) return res.status(400).end();

        let e = await listUserAssignments(Number(req.headers.school), user);
        let s = await getSchool(Number(req.headers.school));

        // Make sure we're not going over limit
        if (e.length >= s.max_assigned) return res.status(400).end();

        let r = await assignMember(task, user, Number(req.headers.school));

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }