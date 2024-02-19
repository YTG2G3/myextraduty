import authRoute from '@/lib/auth-route';
import { NextRequest, NextResponse } from 'next/server';

// Get enrollments and schools of user
export function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return authRoute(async (session) => {
    if (session.user.id !== params.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let data = await prisma.enrollment
      .findMany({
        where: { userId: params.id }
      })
      .then((enrollments) => {
        return Promise.all(
          enrollments.map((enrollment) =>
            prisma.school
              .findUnique({
                where: { id: enrollment.schoolId }
              })
              .then((school) => ({
                enrollment,
                school
              }))
          )
        );
      });

    return NextResponse.json(data);
  });
}
