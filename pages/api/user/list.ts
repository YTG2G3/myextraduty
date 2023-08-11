import AuthRoute from "@/lib/auth-route";
import { listUsers } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let l = await listUsers();
        res.json(l);
    }
}, true);

export const config = { api: { externalResolver: true, } }