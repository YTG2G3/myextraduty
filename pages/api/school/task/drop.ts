import AuthRoute from "@/lib/auth-route";
import { removeMemberFromTask } from "@/lib/db";
import { Profile } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        // TODO - disable feature for the moment but later optional from settings
        return res.status(400).end();

        let { task } = JSON.parse(req.body);
        let r = await removeMemberFromTask(client, task, user.email);

        res.status(r ? 200 : 400).end();
    }
}, false, true);

export const config = { api: { externalResolver: true, } }