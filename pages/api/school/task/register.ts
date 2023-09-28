import AuthRoute from "@/lib/auth-route";
import { getSchool, getTask, registerMember } from "@/lib/db";
import { Profile } from "@/lib/schema";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        let { task } = JSON.parse(req.body);

        let s = await getSchool(client, Number(req.headers.school));
        let t = await getTask(client, Number(task));

        if (dayjs().isBefore(dayjs(s.opening_at)) || dayjs().isAfter(dayjs.tz(t.ending_date + " " + t.ending_time, s.timezone))) return res.status(400).end();

        let r = await registerMember(client, task, user.email, s.id, t.capacity, s.max_assigned);
        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }