import { signIn } from 'next-auth/react';

export default function oauthSignIn() {
  signIn('google', { callbackUrl: '/school' });
}
