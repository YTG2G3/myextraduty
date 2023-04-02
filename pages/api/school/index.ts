import AuthRoute from "@/lib/auth-route";
import { getSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await getSchool(Number(req.query.school));
        res.json(s);
    }
}, false, true);