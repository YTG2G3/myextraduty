import AuthRoute from "@/lib/auth-route";
import { deleteTask } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { task } = JSON.parse(req.body);

        let r = await deleteTask(task);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }