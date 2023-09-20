import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSchool, getUser, listUserEnrollments } from "./db";
import { Client } from 'pg';

export default function AuthRoute({ GET, POST }: any, admin = false, school = false, owner = false, manager = false): Function {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // Check if logged in
        let session = await getServerSession(req, res, authOptions);
        if (!session) return res.status(401).end();

        // Connect to database
        let client = new Client({ ssl: { rejectUnauthorized: false } });
        await client.connect();

        // Get user
        let user = await getUser(client, session.user.email);
        if (!user) return res.status(401).end();

        // Check if admin
        if (admin && !user.admin) return res.status(403).end();

        // Check association with this school (unnecessary if admin)
        if (school && !user.admin) {
            if (!req.headers.school) return res.status(400).end();

            // Get enrollments
            let er = await listUserEnrollments(client, session.user.email);

            // Check if enrolled
            let s = er.find(v => v.school === Number(req.headers.school));
            if (!s) return res.status(403).end();

            // Check if owner
            if (owner) {
                let ss = await getSchool(client, s.school);
                if (ss.owner !== user.email) return res.status(403).end();
            }

            // Check if manager
            if (manager && !s.manager) return res.status(403).end();
        }

        // Run method
        switch (req.method) {
            case 'GET':
                await GET(req, res, client, user);
                await client.end();
                break;
            case 'POST':
                await POST(req, res, client, user);
                await client.end();
                break;
        }
    }
}