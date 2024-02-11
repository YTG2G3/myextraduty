'use client';

import { Button } from '@/components/ui/button';
import { bricolage } from './fonts';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-col items-center gap-4">
        <span
          className={`${bricolage.className} text-9xl opacity-40 font-black`}
        >
          Error
        </span>
        <span>An error has occured.</span>
        <Button onClick={() => reset()}>Retry</Button>
      </div>
    </div>
  );
}
