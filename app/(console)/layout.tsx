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

  return (
    <>
      {data.length > 0 ?? <InvitationDialog data={data} />}

      {children}
    </>
  );
}
