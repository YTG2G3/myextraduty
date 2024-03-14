import getServerSession from '@/lib/get-server-session';
import { Suspense } from 'react';
import Nav from './nav';

export default async function SchoolLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const session = await getServerSession();

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, schoolId: params.id }
  });
  const school = await prisma.school.findUnique({ where: { id: params.id } });

  const data = {
    enrollment,
    school
  };

  return (
    <div className="flex h-screen w-screen">
      <Nav data={data} />
      <main className="h-[100vh] w-full p-4 overflow-hidden bg-secondary">
        <div className="h-full rounded-md bg-background overflow-scroll">
          <Suspense>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
