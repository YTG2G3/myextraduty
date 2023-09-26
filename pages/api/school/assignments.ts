import AuthRoute from "@/lib/auth-route";
import { listSchoolAssignments } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client) => {
        let s = await listSchoolAssignments(client, Number(req.headers.school));
        res.json(s);
    }
}, false, true);

export const config = { api: { externalResolver: true, } }