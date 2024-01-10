import { createUser, getUser, updateUserInfo } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Client } from "pg";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Email", type: "email", placeholder: "School Email" },
                password: { label: "Password", type: "password", placeholder: "Password (check your email)" }
            },
            async authorize(credentials) {
                let { username: email, password } = credentials;
                let client = new Client({ ssl: { rejectUnauthorized: false } });

                await client.connect();
                let u = await getUser(client, email);

                await client.end();
                return u ? u.password === password ? u : null : null;
            }
        })
    ],
    callbacks: {
        async signIn({ profile, account }) {
            if (account.provider === 'google') {
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
            else if (account.provider === 'credentials') {
                return true;
            }
        }
    }
}

export default NextAuth(authOptions);