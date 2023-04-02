import { createUser, getUser, updateUserInfo } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

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
            let u = await getUser(email);

            return u
                ? await updateUserInfo(email, name, picture)
                : await createUser(email, name, picture);
        }
    }
}

export default NextAuth(authOptions);