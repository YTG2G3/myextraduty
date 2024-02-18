import prisma from '@/lib/db';
import InvitationDialog from '../../components/ui/invitation-dialog';
import getServerSession from '@/lib/get-server-session';
import AuthProvider from './auth-provider';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

// TODO - alert feature as sonner
export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession();
  if (!session) {
    toast.error('You have to sign in first.');
    redirect('/auth/signin');
  }

  // Check if there are any invitations
  async function loadData() {
    'use server';

    // TODO - they have to be ordered properly. the commented code below is sample code to do it.
    // let data = await prisma.invitation.findMany({
    //   where: { email: session.user.email }
    // }).then(invitations => {
    //   return Promise.all(invitations.map(invitation =>
    //     prisma.school.findUnique({
    //       where: { id: invitation.schoolId }
    //     }).then(school =>
    //       prisma.user.findUnique({
    //         where: { id: school.ownerId }
    //       }).then(owner => ({ invitation, school, owner }))
    //     )
    //   ));
    // });
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

      <AuthProvider session={session}>
        <Suspense>{children}</Suspense>
      </AuthProvider>
    </>
  );
}
