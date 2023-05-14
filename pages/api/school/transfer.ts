import AuthRoute from "@/lib/auth-route";
import { transferSchoolOwnership } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { school } = req.headers;
        let { email } = JSON.parse(req.body);

        let r = await transferSchoolOwnership(Number(school), email);

        res.status(r ? 200 : 400).end();
    }
}, false, true, true);

export const config = { api: { externalResolver: true, } }