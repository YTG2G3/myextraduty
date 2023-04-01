import { createUser, getUser } from "@/lib/db";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
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

            // First time logging in 
            return u ? true : await createUser(email, name, picture);
        }
    }
});