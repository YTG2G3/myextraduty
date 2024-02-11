'use client';

import React from 'react';
import oauthSignIn from '@/lib/oauth-sign-in';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  session,
  children
}: {
  session: Session;
  children: React.ReactNode;
}) {
  // If there is no session, go to the login page
  if (!session) {
    oauthSignIn();
    return;
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
