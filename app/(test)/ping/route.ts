import authRoute from '@/lib/auth-route';
import { NextRequest, NextResponse } from 'next/server';

// Return pong if the user is authenticated
export async function GET() {
  return authRoute(async () => {
    return NextResponse.json({ pong: true });
  });
}
