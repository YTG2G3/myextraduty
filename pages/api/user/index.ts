import AuthRoute from "@/lib/auth-route";
import { getUser } from "@/lib/db";
import { User } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default AuthRoute({
    GET: async (req: NextApiRequest, res: NextApiResponse, user: User) => {
        res.json(user);
    }
})