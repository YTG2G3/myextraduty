import AuthRoute from "@/lib/auth-route";
import { listTasks } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await listTasks(Number(req.headers.school));
        res.json(s);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }