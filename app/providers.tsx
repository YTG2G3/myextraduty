'use client';

import { Toaster } from '@/components/ui/sonner';
import { AppProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }) {
  return (
    <>
      {children}
      <AppProgressBar
        height="2px"
        color="#0096FF"
        options={{ showSpinner: false }}
      />
      <Toaster richColors />
    </>
  );
}
