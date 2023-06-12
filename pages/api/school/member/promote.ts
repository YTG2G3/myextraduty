import AuthRoute from "@/lib/auth-route";
import { promoteMember } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { email } = JSON.parse(req.body);

        let s = await promoteMember(Number(req.headers.school), email);
        res.status(s ? 200 : 400).end();
    }
}, false, true, true);

export const config = { api: { externalResolver: true, } }