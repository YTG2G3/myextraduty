import getServerSession from '@/lib/get-server-session';
import { Suspense } from 'react';
import Nav from './nav';

export default async function SchoolLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession();

  // TODO - cache
  let data = await prisma.enrollment
    .findMany({
      where: { userId: session.user.id }
    })
    .then((enrollments) => {
      return Promise.all(
        enrollments.map((enrollment) =>
          prisma.school
            .findUnique({
              where: { id: enrollment.schoolId }
            })
            .then((school) => ({
              enrollment,
              school
            }))
        )
      );
    });

  return (
    <div className="flex h-screen w-screen">
      <Nav data={data} />
      <main className="h-full w-[calc(100%-288px)]">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}
