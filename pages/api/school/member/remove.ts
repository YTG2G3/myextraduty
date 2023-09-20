import AuthRoute from "@/lib/auth-route";
import { getSchool, kickMember, listUserEnrollments } from "@/lib/db";
import { Profile } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        let { email } = JSON.parse(req.body);
        let s = await getSchool(client, Number(req.headers.school));

        // Cannot be commited to oneself unless admin
        if (!user.admin && user.email === email) return res.status(400).end();

        // If user is admin/owner, action is forced
        if (user.admin || (s.owner === user.email)) {
            let x = await kickMember(client, s.id, email);
            return res.status(x ? 200 : 400).end();
        }

        // Elsewise, target must not be a moderator
        let er = await listUserEnrollments(client, email);
        let e = er.find(v => v.school === s.id);

        if (!e.manager) {
            let x = await kickMember(client, s.id, email);
            return res.status(x ? 200 : 400).end();
        }

        res.status(200).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }