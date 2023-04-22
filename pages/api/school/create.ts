import AuthRoute from "@/lib/auth-route";
import { createSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let { name, owner, address, primary_color, logo } = JSON.parse(req.body);

        let r = await createSchool(name, owner, address, primary_color, logo);

        res.status(r ? 200 : 400).end();
    }
}, true);