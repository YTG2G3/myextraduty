import AuthRoute from "@/lib/auth-route";
import { enrollUsers } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { emails } = JSON.parse(req.body);

        let s = await enrollUsers(Number(req.headers.school), emails);
        res.json({ success: s, requested: emails.length });
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }