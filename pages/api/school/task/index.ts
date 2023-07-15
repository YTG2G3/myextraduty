import AuthRoute from "@/lib/auth-route";
import { getEnrollments, getSchool, listTasks } from "@/lib/db";
import { User } from "@/lib/schema";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, user: User) => {
        let s = await getSchool(Number(req.headers.school));

        // Must have manager/admin rights before d-day
        if (dayjs(s.opening_at).isBefore(dayjs())) {
            let er = await getEnrollments(user.email);
            if (!er.find(v => v.school === s.id).manager) return res.status(401).end();
        }

        let x = await listTasks(s.id);
        res.json(x);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }