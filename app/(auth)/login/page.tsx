'use client';

import GoogleIcon from '@/components/svg/google';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignIn() {
  return (
    <div className="h-screen w-screen">
      <div className="flex justify-center mt-4 items-center">
        <Link href="/" className={navigationMenuTriggerStyle()}>
          <span className="text-xl text-center font-grotesque font-light">
            Go back to
            <span
              className="ml-1.5 font-extrabold"
              style={{ letterSpacing: '-0.05em' }}
            >
              MyED
            </span>
          </span>
        </Link>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-around">
        <div className="flex flex-col items-center">
          <h1 className={`text-center font-grotesque text-9xl font-bold`}>
            Welcome Back!
          </h1>
          <span className="text-lg text-muted-foreground">
            Sign in to access MyED.
          </span>
        </div>
        <Card className="mb-32 flex flex-col gap-2 p-4">
          <Button
            onClick={() => signIn('google', { callbackUrl: '/school' })}
            className="w-full"
            variant="outline"
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
        </Card>
        <span className="text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </span>
      </div>
    </div>
  );
}
