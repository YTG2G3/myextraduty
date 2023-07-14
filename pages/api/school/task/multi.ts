import AuthRoute from "@/lib/auth-route";
import { createTasks } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { tasks } = JSON.parse(req.body);

        let s = await createTasks(Number(req.headers.school), tasks);
        res.json({ success: s, requested: tasks.length });
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }