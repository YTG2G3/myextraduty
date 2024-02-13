'use client';

import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }) {
  return (
    <>
      {children}
      <Toaster richColors />
    </>
  );
}
