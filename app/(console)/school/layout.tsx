import getServerSession from '@/lib/get-server-session';
import { School } from '@/prisma/client';
import { Suspense } from 'react';
import SchoolNav from './nav';

interface SchoolLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SchoolLayout({
  children,
  params
}: SchoolLayoutProps) {
  let session = await getServerSession();

  let schooldata: School = undefined;
  if (params?.id) {
    schooldata = await prisma.school.findUnique({
      where: { id: params.id }
    });
  }

  return (
    <div className="flex h-screen w-screen">
      <SchoolNav schoolData={schooldata} />
      <main className="w-screen">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}
