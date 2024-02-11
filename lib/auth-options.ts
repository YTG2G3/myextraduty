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
        session({ session, user }: { session: any, user: any }) {
            return {
                ...session, user: {
                    ...session.user,
                    id: user.id,
                    admin: user.admin
                }
            }
        }
    },
    theme: {
        colorScheme: 'light',
        logo: '/myed_full.png',
    }
};

export default authOptions;