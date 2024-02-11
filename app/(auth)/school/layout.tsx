import { redirect } from 'next/navigation';
import Nav from './nav';
import getServerSession from '@/lib/get-server-session';

export default async function SchoolLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
    return <></>;
  }

  let enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id }
  });
  let schools = await prisma.school.findMany({
    where: { id: { in: enrollments.map((enrollment) => enrollment.schoolId) } }
  });

  return (
    <div className="w-screen h-screen flex">
      <Nav schools={schools} enrollments={enrollments} />

      <main className="w-[calc(100%-288px)] h-full">{children}</main>
    </div>
  );
}
