import AuthSession from '@/lib/auth-session';
import prisma from '@/lib/db';
import getServerSession from '@/lib/get-server-session';

export default async function RoleRoute({
  id,
  user: User,
  manager: Manager
}: {
  id: string;
  user: any;
  manager: any;
}) {
  let session = await getServerSession();
  let { manager } = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    select: { manager: true }
  });

  // TODO - cache
  let school = await prisma.school.findUnique({ where: { id: id } });
  let tasks = await prisma.task.findMany({ where: { schoolId: id } });

  if ((manager && !Manager) || (!manager && User))
    return <User {...{ session, school, tasks }} />;

  // TODO - cache
  let invitations = manager
    ? await prisma.invitation.findMany({ where: { schoolId: id } })
    : null;
  let enrollments = manager
    ? await prisma.enrollment.findMany({ where: { schoolId: id } })
    : null;

  if (manager)
    return (
      <Manager {...{ session, school, tasks, invitations, enrollments }} />
    );

  // TODO - change this into actual 403 error
  return <>403</>;
}
