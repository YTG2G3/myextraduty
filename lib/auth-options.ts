import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './db';
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
    session: async ({ session, token } : { session: any; token: any }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          admin: token.admin
        }
      };
    },
  },
  theme: {
    colorScheme: 'light'
  },
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
};

export default authOptions;
