import AuthRoute from "@/lib/auth-route";
import { getAssignedTasks } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let { email } = req.query;
        let e = email as string;

        let s = await getAssignedTasks(Number(req.headers.school), e);
        res.json(s);
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }