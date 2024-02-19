import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import authRoute from '@/lib/auth-route';

// Get all invitations for this email
export default async function GET(
  request: NextRequest,
  { email }: { email: string }
) {
  authRoute(async (session) => {
    let invitations = await prisma.invitation.findMany({
      where: {
        email
      }
    });

    return NextResponse.json(invitations);
  });
}
