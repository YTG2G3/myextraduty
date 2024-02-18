import prisma from '@/lib/db';
import getServerSession from '@/lib/get-server-session';
import { bricolage } from '@/app/fonts';
import BackButton from '@/components/utils/back-button';

export default async function RoleRoute({
  id,
  user: User,
  manager: Manager,
  ...params
}: {
  id: string;
  user: any;
  manager: any;
  [key: string]: any; // TODO - is this dark magic?
}) {
  let session = await getServerSession();
  let { manager } = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, schoolId: id },
    select: { manager: true }
  });
  const owner = await prisma.school.findUnique({
    where: { id: id, ownerId: session.user.id }
  });
  if (owner) manager = true;

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

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col items-center gap-4">
        <span
          className={`${bricolage.className} text-9xl opacity-40 font-black`}
        >
          Unauthorized
        </span>
        <span>You don&apos;t have permissions to access this content.</span>
        <BackButton />
      </div>
    </div>
  );
}
