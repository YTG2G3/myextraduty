import Nav from './nav';
import getServerSession from '@/lib/get-server-session';
import { Suspense } from 'react';

export default async function SchoolLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession();

  let enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id }
  });

  let schools = await prisma.school.findMany({
    where: { id: { in: enrollments.map((enrollment) => enrollment.schoolId) } }
  });

  return (
    <div className="flex h-screen w-screen">
      <Nav schools={schools} enrollments={enrollments} />
      <main className="h-full w-[calc(100%-288px)]">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}