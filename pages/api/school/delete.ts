import AuthRoute from "@/lib/auth-route";
import { deleteSchool } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let r = await deleteSchool(Number(req.body));

        res.status(r ? 200 : 400).end();
    }
}, true);

export const config = { api: { externalResolver: true, } }