import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";
import AuthProvider from "@/components/auth/auth-provider";
import prisma from "@/lib/db";
import InvitationDialog from "@/components/auth/invitation-dialog";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await getServerSession(authOptions);

    // Check if there are any invitations
    let invitations = await prisma.invitation.findMany({ where: { email: session.user.email } });
    let schools = await prisma.school.findMany({ where: { id: { in: invitations.map((invitation) => invitation.schoolId) } } });
    let owners = await prisma.user.findMany({ where: { id: { in: schools.map((school) => school.ownerId) } } });

    // Receive invitation id and school id
    async function decide(index: number, accept: boolean) {
        'use server'

        if (accept) prisma.enrollment.create({
            data: {
                userId: session.user.id,
                schoolId: schools[index].id,
                manager: invitations[index].manager
            }
        });

        prisma.invitation.delete({ where: { id: invitations[index].id } });
    }

    return (
        <>
            <InvitationDialog invitations={invitations} schools={schools} owners={owners} decide={decide} />

            <AuthProvider session={session}>
                {children}
            </AuthProvider>
        </>
    );
}
