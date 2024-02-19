import authRoute from '@/lib/auth-route';
import { NextResponse } from 'next/server';

// Return pong if the user is authenticated
export async function GET() {
  return authRoute(async () => {
    return NextResponse.json({ pong: true });
  });
}
