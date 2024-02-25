import InvitationDialog from '@/components/utils/invitation-dialog';
import getServerSession from '@/lib/get-server-session';

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession();

  // TODO - cache
  let data = await prisma.invitation
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

  async function decide(index: number, accept: boolean) {
    'use server';

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

  return (
    <>
      {data.length > 0 ?? <InvitationDialog data={data} decide={decide} />}

      {children}
    </>
  );
}
