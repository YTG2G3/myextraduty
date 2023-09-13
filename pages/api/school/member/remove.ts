import AuthRoute from "@/lib/auth-route";
import { getEnrollments, getSchool, kickMember } from "@/lib/db";
import { User } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    POST: async (req: NextApiRequest, res: NextApiResponse, user: User) => {
        let { email } = JSON.parse(req.body);
        let s = await getSchool(Number(req.headers.school));

        // Cannot be commited to oneself unless admin
        if (!user.admin && user.email === email) return res.status(400).end();

        // If user is admin/owner, action is forced
        if (user.admin || (s.owner === user.email)) {
            let x = await kickMember(s.id, email);
            return res.status(x ? 200 : 400).end();
        }

        // Elsewise, target must not be a moderator
        let er = await getEnrollments(email);
        let e = er.find(v => v.school === s.id);

        if (!e.manager) {
            let x = await kickMember(s.id, email);
            return res.status(x ? 200 : 400).end();
        }

        res.status(401).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }