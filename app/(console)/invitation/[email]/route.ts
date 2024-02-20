import authRoute from '@/lib/auth-route';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get all invitations for this email
export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  return authRoute(async (session) => {
    if (session.user.email !== params.email)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let data = await prisma.invitation
      .findMany({
        where: { email: params.email }
      })
      .then((invitations) => {
        return Promise.all(
          invitations.map((invitation) =>
            prisma.school
              .findUnique({
                where: { id: invitation.schoolId }
              })
              .then((school) =>
                prisma.user
                  .findUnique({
                    where: { id: school.ownerId }
                  })
                  .then((owner) => ({ invitation, school, owner }))
              )
          )
        );
      });

    return NextResponse.json(data);
  });
}
