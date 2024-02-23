import authRoute from '@/lib/auth-route';
import { NextRequest, NextResponse } from 'next/server';

// Decide whether to accept or decline the invitation
export async function POST(request: NextRequest) {
  return authRoute(async (session) => {
    const data = await request.json();
    const { id, accept } = data;

    let invitation = await prisma.invitation.findUnique({ where: { id } });

    if (!invitation)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (invitation.email !== session.user.email)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
      if (accept) {
        await prisma.enrollment.create({
          data: {
            userId: session.user.id,
            schoolId: invitation.schoolId,
            manager: invitation.manager
          }
        });
        await prisma.invitation.delete({ where: { id } });
      } else await prisma.invitation.delete({ where: { id } });

      return NextResponse.json({ error: null }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
