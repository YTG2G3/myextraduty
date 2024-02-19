'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import GoogleIcon from '@/components/svg/google';

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-around">
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
  );
}
