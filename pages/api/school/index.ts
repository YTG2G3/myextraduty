import AuthRoute from "@/lib/auth-route";
import { createSchool, getSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await getSchool(Number(req.query.school));
        res.json(s);
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { name, owner, address, primary_color, logo } = req.body;
        let r = await createSchool(name, owner, address, primary_color, logo);

        res.status(r ? 200 : 400).end();
    }
}, false, true);