import AuthRoute from "@/lib/auth-route";
import { listSchools } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let s = await listSchools();
        res.json(s);
    }
}, true);

export const config = { api: { externalResolver: true, } }