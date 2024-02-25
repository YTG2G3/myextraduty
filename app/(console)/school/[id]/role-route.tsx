import prisma from '@/lib/db';
import getServerSession from '@/lib/get-server-session';
import { redirect } from 'next/navigation';

export default async function RoleRoute({
  id,
  user: User,
  manager: Manager,
  ...params
}: {
  id: string;
  user: any;
  manager: any;
  [key: string]: any; // TODO - is this dark magic? for receiving any other props
}) {
  let session = await getServerSession();

  // Check if user is associated with the school
  let enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, schoolId: id },
    select: { manager: true }
  });

  if (!enrollment) redirect('/school');

  const owner = await prisma.school.findUnique({
    where: { id: id, ownerId: session.user.id }
  });

  // User is a manager if they are the owner or have been assigned as a manager
  let manager = enrollment.manager || owner.id === session.user.id;

  // TODO - cache
  let school = await prisma.school.findUnique({ where: { id: id } });
  let tasks = await prisma.task.findMany({ where: { schoolId: id } });

  if ((manager && !Manager) || (!manager && User))
    return <User {...{ session, school, tasks, ...params }} />;

  // TODO - cache
  let invitations = manager
    ? await prisma.invitation.findMany({ where: { schoolId: id } })
    : null;
  let enrollments = manager
    ? await prisma.enrollment.findMany({ where: { schoolId: id } })
    : null;

  if (manager)
    return (
      <Manager
        {...{ session, school, tasks, invitations, enrollments, ...params }}
      />
    );

  redirect('/school');
}
