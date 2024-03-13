'use client';

import { Toaster } from '@/components/ui/sonner';
import AuthSession from '@/lib/auth-session';
import { SessionProvider } from 'next-auth/react';
import { AppProgressBar } from 'next-nprogress-bar';
import { useServerInsertedHTML } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function RootProvider({
  children,
  session
}: {
  children: React.ReactNode;
  session: AuthSession;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') {
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
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
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
    </StyleSheetManager>
  );
}
