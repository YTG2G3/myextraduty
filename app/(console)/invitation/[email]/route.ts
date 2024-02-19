import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import authRoute from '@/lib/auth-route';

// Get all invitations for this email
export default async function GET(
  request: NextRequest,
  { email }: { email: string }
) {
  authRoute(async (session) => {
    if (session.user.email !== email)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let data = await prisma.invitation
      .findMany({
        where: { email }
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
