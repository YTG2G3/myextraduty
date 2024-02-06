import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        session({ session, user }) {
            return {
                ...session, user: {
                    ...session.user,
                    id: user.id,
                    admin: user.admin
                }
            }
        }
    }
};

export default authOptions;