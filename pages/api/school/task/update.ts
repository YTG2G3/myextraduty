import AuthRoute from "@/lib/auth-route";
import { updateTask } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { task, category, location, description, starting_date, ending_date, starting_time, ending_time, capacity } = JSON.parse(req.body);

        let r = await updateTask(task, category, location, description, starting_date, ending_date, starting_time, ending_time, capacity);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }