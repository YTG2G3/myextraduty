'use client';

import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

export default function AuthError() {
  const router = useRouter();
  const params = useParams<{ error: string }>();

  const errorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'Configuration':
        return 'There is a configuration error. Contact support.';
      case 'AccessDenied':
        return 'Access to the requested resource is denied.';
      case 'Verification':
        return 'The token has expired or has already been used. Please try again.';
      default:
        return 'An error has occured while authorization.';
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className={`font-grotesque text-9xl font-black opacity-40`}>
          Error
        </span>
        <span>{errorMessage(params.error)}</span>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    </div>
  );
}
