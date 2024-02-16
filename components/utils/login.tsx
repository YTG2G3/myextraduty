'use client';

import oauthSignIn from '@/lib/oauth-sign-in';

export default function Login() {
  oauthSignIn();
  return <>Please Wait...</>;
}
