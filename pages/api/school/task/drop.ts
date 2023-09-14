import AuthRoute from "@/lib/auth-route";
import { removeMemberFromTask } from "@/lib/db";
import { Profile } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, user: Profile) => {
        let { task } = JSON.parse(req.body);

        let r = await removeMemberFromTask(task, user.email);

        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }