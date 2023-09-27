import AuthRoute from "@/lib/auth-route";
import { getSchool, getTask, listSchoolEnrollments, getUser, registerMember } from "@/lib/db";
import { Member, Profile } from "@/lib/schema";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        let { task } = JSON.parse(req.body);

        let s = await getSchool(client, Number(req.headers.school));
        let er = await listSchoolEnrollments(client, s.id);
        let t = await getTask(client, Number(task));

        let m: Member[] = [];
        for (let i of er) {
            let x = await getUser(client, i.email);
            m.push({ ...x, manager: i.manager });
        }

        // TODO - customizable timezone
        if (!m.find(v => v.email === user.email && (v.manager || v.admin)) && dayjs().isAfter(dayjs.tz(t.ending_date + " " + t.ending_time, "America/Los_Angeles"))) return res.status(400).end();

        let r = await registerMember(client, task, user.email, s.id, t.capacity, s.max_assigned);
        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }