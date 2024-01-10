import AuthRoute from "@/lib/auth-route";
import { enrollUser, getUser, listSchoolEnrollments, listUserEnrollments } from "@/lib/db";
import { Member } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let s = await listSchoolEnrollments(client, Number(req.headers.school));
        let u: Member[] = [];

        for (let er of s) {
            let uu = await getUser(client, er.email);
            u.push({ ...(uu ?? { admin: false, email: er.email, name: "", picture: "", password: "" }), manager: er.manager });
        }

        res.json(u);
    },
    POST: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let { email } = JSON.parse(req.body);

        // Email format
        if (!email.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(400).end();

        // Already enrolled
        let er = await listUserEnrollments(client, email);
        if (er.find(v => v.school === Number(req.headers.school))) return res.status(400).end();

        let s = await enrollUser(client, Number(req.headers.school), email);
        res.status(s ? 200 : 400).end();
    }
}, false, true, false, true);

export const config = { api: { externalResolver: true, } }