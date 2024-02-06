import { getServerSession } from "next-auth";
import Nav from "./nav";
import authOptions from "@/lib/auth-options";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await getServerSession(authOptions);
    let enrollments = await prisma.enrollment.findMany({ where: { userId: session.user.id } });
    let schools = await prisma.school.findMany({ where: { id: { in: enrollments.map((enrollment) => enrollment.schoolId) } } });

    return (
        <>
            <Nav session={session} schools={schools} enrollments={enrollments} />

            {children}
        </>
    );
}
