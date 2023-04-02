import { getUser } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let session = await getServerSession(req, res, authOptions);
    if (!session?.user || !session?.user.email) return;

    switch (req.method) {
        case "GET":
            let u = await getUser(session.user.email);
            res.json(u);
            return;
    }

    res.status(404).end();
}