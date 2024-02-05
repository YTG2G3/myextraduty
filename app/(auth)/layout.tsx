import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth-options";
import AuthProvider from "@/components/auth/auth-provider";
import prisma from "@/lib/db";
import { Invitation, School, User } from "@prisma/client";
import InvitationDialog from "@/components/auth/invitation-dialog";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await getServerSession(authOptions);

    // Check if there are any invitations
    let invitations = await prisma.invitation.findMany({ where: { email: session.user.email } });

    // New array of schools that the user has been invited to
    let schools: School[] = [];
    let owners: User[] = [];

    for (let invitation of invitations) {
        let school = await prisma.school.findUnique({ where: { id: invitation.schoolId } });
        let owner = await prisma.user.findUnique({ where: { id: school.ownerId } });

        schools.push(school);
        owners.push(owner);
    }

    // Receive invitation id and school id
    async function decide(id: string, school: string, accept: boolean) {
        'use server'

        if (accept) prisma.enrollment.create({
            data: {
                userId: session.user.id,
                schoolId: school
            }
        });

        prisma.invitation.delete({ where: { id } });
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
