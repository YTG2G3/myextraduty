'use client';

import { Toaster } from '@/components/ui/sonner';
import AuthSession from '@/lib/auth-session';
import { SessionProvider } from 'next-auth/react';
import { AppProgressBar } from 'next-nprogress-bar';
import React, { Suspense } from 'react';

export default function RootProvider({
  children,
  session
}: {
  children: React.ReactNode;
  session: AuthSession;
}) {
  return (
    <>
      <SessionProvider basePath="/auth" session={session}>
        {children}
      </SessionProvider>

      <Suspense fallback={null}>
        <AppProgressBar
          height="2px"
          color="#0096FF"
          options={{ showSpinner: false }}
        />
      </Suspense>

      <Toaster richColors />
    </>
  );
}
