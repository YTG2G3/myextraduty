import AuthRoute from "@/lib/auth-route";
import { getSchool, listTasks } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await getSchool(Number(req.headers.school));

        let x = await listTasks(s.id);
        res.json(x);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }