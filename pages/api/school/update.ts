import AuthRoute from "@/lib/auth-route";
import { updateSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { school } = req.headers;
        let { owner, address, primary_color, logo } = JSON.parse(req.body);

        let r = await updateSchool(Number(school), owner, address, primary_color, logo);

        res.status(r ? 200 : 400).end();
    }
}, false, true, true);