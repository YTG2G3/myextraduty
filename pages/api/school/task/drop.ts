import AuthRoute from "@/lib/auth-route";
import { getSchool, getTask, removeMemberFromTask } from "@/lib/db";
import { Profile } from "@/lib/schema";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        let s = await getSchool(client, Number(req.headers.school));
        if (!s.drop_enabled) return res.status(403).end();

        let { task } = JSON.parse(req.body);
        let t = await getTask(client, Number(task));

        if (dayjs().isAfter(dayjs.tz(t.ending_date + " " + t.ending_time, s.timezone))) return res.status(400).end();

        let r = await removeMemberFromTask(client, task, user.email);
        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }