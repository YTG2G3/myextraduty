import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getEnrollments, getSchool, getUser } from "./db";

export default function AuthRoute({ GET, POST }: any, admin = false, school = false, owner = false, manager = false): Function {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // Check if logged in
        let session = await getServerSession(req, res, authOptions);
        if (!session) return res.status(401).end();

        // Get user
        let user = await getUser(session.user.email);
        if (!user) return res.status(401).end();

        // Check if admin
        if (admin && !user.admin) return res.status(403).end();

        // Check association with this school (unnecessary if admin)
        if (school && !user.admin) {
            if (!req.headers.school) return res.status(400).end();

            let er = await getEnrollments(session.user.email);
            let s = er.find(v => v.school === Number(req.headers.school));

            // Check if enrolled
            if (!s) return res.status(403).end();

            // Check if owner
            if (owner) {
                let ss = await getSchool(s.school);
                if (ss.owner !== user.email) return res.status(403).end();
            }

            // Check if manager
            if (manager && !s.manager) return res.status(403).end();
        }

        switch (req.method) {
            case 'GET': GET(req, res, user); break;
            case 'POST': POST(req, res, user); break;
        }
    }
}