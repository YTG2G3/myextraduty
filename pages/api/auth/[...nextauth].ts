import { createUser, getUser, updateUserInfo } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { Client } from "pg";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async signIn({ profile }) {
            let { email, name, picture }: any = profile;
            let client = new Client({ ssl: { rejectUnauthorized: false } });

            await client.connect();
            let u = await getUser(client, email);

            let res = u
                ? await updateUserInfo(client, email, name, picture)
                : await createUser(client, email, name, picture);

            await client.end();
            return res;
        }
    }
}

export default NextAuth(authOptions);