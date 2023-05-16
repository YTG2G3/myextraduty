import AuthRoute from "@/lib/auth-route";
import { enrollUser, listMembers } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await listMembers(Number(req.headers.school));
        res.json(s);
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await enrollUser(Number(req.headers.school), req.body.email);
        res.status(s ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }