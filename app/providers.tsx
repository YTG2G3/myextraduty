'use client';

import { Toaster } from '@/components/ui/sonner';
import { AppProgressBar } from 'next-nprogress-bar';
import { Suspense } from 'react';

export default function Providers({ children }) {
  return (
    <>
      {children}
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
