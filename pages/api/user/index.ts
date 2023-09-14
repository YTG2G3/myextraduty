import AuthRoute from "@/lib/auth-route";
import { Profile } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, user: Profile) => {
        res.json(user);
    }
});

export const config = { api: { externalResolver: true, } }