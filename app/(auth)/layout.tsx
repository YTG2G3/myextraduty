import prisma from '@/lib/db';
import InvitationDialog from './invitation-dialog';
import getServerSession from '@/lib/get-server-session';
import Login from '@/components/login';
import AuthProvider from './auth-provider';

// TODO - alert feature as sonner
export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession();
  if (!session) return <Login />;

  // Check if there are any invitations
  async function loadData() {
    'use server';

    let invitations = await prisma.invitation.findMany({
      where: { email: session.user.email }
    });
    let schools = await prisma.school.findMany({
      where: {
        id: { in: invitations.map((invitation) => invitation.schoolId) }
      }
    });
    let owners = await prisma.user.findMany({
      where: { id: { in: schools.map((school) => school.ownerId) } }
    });

    return { invitations, schools, owners };
  }

  // Receive invitation id and school id
  async function decide(
    id: string,
    schoolId: string,
    manager: boolean,
    accept: boolean
  ) {
    'use server';

    if (accept)
      prisma.enrollment.create({
        data: {
          userId: session.user.id,
          schoolId,
          manager
        }
      });

    prisma.invitation.delete({ where: { id } });
  }

  return (
    <>
      <InvitationDialog loadData={loadData} decide={decide} />

      <AuthProvider session={session}>{children}</AuthProvider>
    </>
  );
}
