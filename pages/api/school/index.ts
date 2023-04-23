import AuthRoute from "@/lib/auth-route";
import { getSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await getSchool(Number(req.headers.school));
        res.json(s);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }