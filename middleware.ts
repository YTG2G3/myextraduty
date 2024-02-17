import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    authorized: async ({ token }) => {
      return !!token;
    },
  }
});

export const config = { matcher: ['/school/:path*'] };
