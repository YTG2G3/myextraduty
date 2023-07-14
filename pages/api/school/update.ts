import AuthRoute from "@/lib/auth-route";
import { updateSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { school } = req.headers;
        let { address, primary_color, logo, opening_at, quota, max_assigned } = JSON.parse(req.body);

        let r = await updateSchool(Number(school), address, primary_color, logo, new Date(opening_at), quota, max_assigned);

        res.status(r ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }