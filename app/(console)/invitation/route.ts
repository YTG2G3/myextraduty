import authRoute from '@/lib/auth-route';
import { NextRequest, NextResponse } from 'next/server';

// Decide whether to accept or decline the invitation
export async function POST(request: NextRequest) {
  authRoute(async (session) => {
    let { id, accept } = await request.json();
    let invitation = await prisma.invitation.findUnique({ where: { id } });

    if (!invitation)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (invitation.email !== session.user.email)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    if (accept)
      prisma.enrollment.create({
        data: {
          userId: session.user.id,
          schoolId: invitation.schoolId,
          manager: invitation.manager
        }
      });
    else prisma.invitation.delete({ where: { id } });

    return NextResponse.json({ error: null });
  });
}
