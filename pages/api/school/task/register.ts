import AuthRoute from "@/lib/auth-route";
import { assignMember, listUserAssignments, getSchool, getTask, listAttendants, listMembers } from "@/lib/db";
import { Profile } from "@/lib/schema";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, user: Profile) => {

        let { task } = JSON.parse(req.body);
        let s = await getSchool(Number(req.headers.school));
        console.log("a");

        let m = await listMembers(s.id);
        console.log("b", task);
        res.status(400).end();

        return;
        let a = await listAttendants(Number(task));
        console.log("c");
        try {
            let x = await getTask(Number(task));
            console.log(x);

        } catch (error) {
            console.log(error);

        }
        console.log("d");


        // Can't sign up for completed events unless manager
        // res.json({ today: dayjs().toISOString(), after: dayjs(t.ending_date + " " + t.ending_time).toISOString() });
        res.status(400).end();
        return;
        let t = await getTask(Number(task));

        if (!m.find(v => v.email === user.email && (v.manager || v.admin)) && dayjs().isAfter(dayjs(t.ending_date + " " + t.ending_time))) return res.status(400).end();

        // Make sure it's not full
        if (a.length >= t.capacity) return res.status(400).end();

        // Make sure it's not overlapping
        if (a.find(v => v.email === user.email)) return res.status(400).end();

        let e = await listUserAssignments(s.id, user.email);

        // Make sure we're not going over limit
        if (e.length >= s.max_assigned) return res.status(400).end();

        let r = await assignMember(task, user.email, s.id);

        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }