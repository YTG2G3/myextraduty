'use client';

import oauthSignIn from '@/lib/oauth-sign-in';
import { Eclipse } from 'react-svg-spinners';

export default function Login() {
  oauthSignIn();
  return (
    <div className="w-full h-full">
      <Eclipse className="h-16 w-16" />
    </div>
  );
}
