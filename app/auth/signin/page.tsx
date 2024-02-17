'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { bricolage } from '@/app/fonts';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import GoogleIcon from '@/components/svg/google';

export default function SignIn() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className="w-80">
        <CardHeader>
          <CardTitle
            className={`${bricolage.className} font-bold text-4xl`}
            style={{ letterSpacing: '-0.05em' }}
          >
            Welcome Back!
          </CardTitle>
          <CardDescription>Sign in to access MyED.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn('google', { callbackUrl: '/school' })}
            className="w-full"
            variant="outline"
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
