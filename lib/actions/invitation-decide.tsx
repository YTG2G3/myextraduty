'use server';

import { Invitation, School, User } from '@/prisma/client';
import getServerSession from '../get-server-session';

export async function decide(
  data: { invitation: Invitation; school: School; owner: User }[],
  index: number,
  accept: boolean
) {
  const session = await getServerSession();

  try {
    await prisma.invitation.delete({
      where: { id: data[index].invitation.id }
    });

    if (accept) {
      await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          schoolId: data[index].invitation.schoolId,
          manager: data[index].invitation.manager // invited role
        }
      });
    }
  } catch (error) {
    return false;
  }

  return true;
}
