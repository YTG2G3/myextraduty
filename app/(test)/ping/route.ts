import authRoute from '@/lib/auth-route';
import { NextRequest, NextResponse } from 'next/server';

// Return pong if the user is authenticated
export async function GET(request: NextRequest) {
  return authRoute(request, async () => {
    return NextResponse.json({ pong: true });
  });
}
