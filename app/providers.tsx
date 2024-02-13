'use client';

import { Toaster } from '@/components/ui/sonner';
import { AppProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }) {
  return (
    <>
      {children}
      <AppProgressBar
        height="4px"
        color="#020817"
        options={{ showSpinner: false }}
      />
      <Toaster richColors />
    </>
  );
}
