import AuthRoute from "@/lib/auth-route";
import { assignMember, listUserAssignments, getSchool, getTask, listSchoolEnrollments, listTaskAssignments, getUser } from "@/lib/db";
import { Member, Profile } from "@/lib/schema";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        let { task } = JSON.parse(req.body);

        let s = await getSchool(client, Number(req.headers.school));
        let er = await listSchoolEnrollments(client, s.id);
        let a = await listTaskAssignments(client, Number(task));
        let t = await getTask(client, Number(task));

        let m: Member[] = [];
        for (let i of er) {
            let x = await getUser(client, i.email);
            m.push({ ...x, manager: i.manager });
        }

        // TODO - customizable timezone
        if (!m.find(v => v.email === user.email && (v.manager || v.admin)) && dayjs().isAfter(dayjs.tz(t.ending_date + " " + t.ending_time, "America/Los_Angeles"))) return res.status(400).end();

        // Make sure it's not full
        if (a.length >= t.capacity) return res.status(400).end();

        // Make sure it's not overlapping
        if (a.find(v => v.email === user.email)) return res.status(400).end();

        let e = await listUserAssignments(client, s.id, user.email);

        // Make sure we're not going over limit
        if (e.length >= s.max_assigned) return res.status(400).end();

        let r = await assignMember(client, task, user.email, s.id);

        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }