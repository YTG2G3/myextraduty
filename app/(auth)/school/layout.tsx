import Nav from "./nav";
import getServerSession from "@/lib/get-server-session";

export default async function SchoolLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let session = await getServerSession();
    let enrollments = await prisma.enrollment.findMany({ where: { userId: session.user.id } });
    let schools = await prisma.school.findMany({ where: { id: { in: enrollments.map((enrollment) => enrollment.schoolId) } } });

    return (
        <div className="w-screen flex">
            <Nav schools={schools} enrollments={enrollments} />

            {children}
        </div>
    );
}
