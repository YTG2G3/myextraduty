import getServerSession from '@/lib/get-server-session';
import { School } from '@/prisma/client';
import SchoolSelector from './school-selector';

export interface SchoolSelectorData {
  school: School;
  manager: boolean;
}

export default async function SchoolInit() {
  const session = await getServerSession();

  const schools = (await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    select: { school: true, manager: true }
  })) as SchoolSelectorData[];

  const invitations = await prisma.invitation
    .findMany({
      where: { email: session.user.email }
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

  return (
    <div className="w-screen h-screen bg-secondary p-4">
      <div className="h-full w-full rounded-md bg-background overflow-scroll">
        <SchoolSelector data={schools} invitations={invitations} />
      </div>
    </div>
  );
}
