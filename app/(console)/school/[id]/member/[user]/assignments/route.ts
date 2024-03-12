import getServerSession from '@/lib/get-server-session';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string; user: string } }
) {
  const school_id = context.params.id;
  const user_id = context.params.user;

  const session = await getServerSession();

  // check if user is admin of the school
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, schoolId: school_id },
    select: { manager: true }
  });
  if (!enrollment) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const assignments = await prisma.assignment.findMany({
    include: { task: true },
    where: {
      userId: user_id,
      task: {
        schoolId: school_id
      }
    }
  });

  return NextResponse.json({
    count: assignments.length
  });
}
