import AuthRoute from "@/lib/auth-route";
import { Profile } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, client: Client, user: Profile) => {
        res.json(user);
    }
});

export const config = { api: { externalResolver: true, } }