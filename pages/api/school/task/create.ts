import AuthRoute from "@/lib/auth-route";
import { createTask } from "@/lib/db";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let sid = Number(req.headers.school);
        let { category, name, description, starting_date, starting_time, ending_date, ending_time, capacity } = JSON.parse(req.body);

        // Start < End
        if (dayjs(starting_date + " " + starting_time).isAfter(dayjs(ending_date + " " + ending_time))) return res.status(400).end();

        let r = await createTask(sid, category, name, description, starting_date, ending_date, starting_time, ending_time, capacity);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }