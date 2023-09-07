import AuthRoute from "@/lib/auth-route";
import { listMembers, transferSchoolOwnership } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { school } = req.headers;
        let { email } = JSON.parse(req.body);

        // Must be enrolled already
        let m = await listMembers(Number(school));
        if (!m.find(m => m.email === email)) return res.status(400).end();

        let r = await transferSchoolOwnership(Number(school), email);

        res.status(r ? 200 : 400).end();
    }
}, false, true, true);

export const config = { api: { externalResolver: true, } }