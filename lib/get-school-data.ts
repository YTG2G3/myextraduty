'use server';

import { SchoolNavData } from '@/app/(console)/school/nav';
import getServerSession from './get-server-session';

export async function getSchoolData(id): Promise<SchoolNavData> {
  const session = await getServerSession();
  const data = await prisma.school.findUnique({
    where: { id }
  });
  const isManager = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, schoolId: id, manager: true }
  });
  return {
    id: data.id,
    name: data.name,
    image: data.image,
    manager: !!isManager
  };
}
