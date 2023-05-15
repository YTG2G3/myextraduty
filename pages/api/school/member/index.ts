import AuthRoute from "@/lib/auth-route";
import { listMembers } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await listMembers(Number(req.headers.school));
        res.json(s);
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }