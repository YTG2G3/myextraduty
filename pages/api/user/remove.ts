import AuthRoute from "@/lib/auth-route";
import { removeUser } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        let r = await removeUser(req.body);
        res.status(r ? 200 : 400).end();
    }
}, true);

export const config = { api: { externalResolver: true, } }