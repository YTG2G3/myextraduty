import AuthRoute from "@/lib/auth-route";
import { getUser, listAttendants } from "@/lib/db";
import { User } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
        let { task } = req.query;

        let s = await listAttendants(Number(task));
        res.json(s);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }