import getServerSession from '@/lib/get-server-session';
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

  return (
    <div className="h-screen w-screen">
      <SchoolNav />
      <main className="w-screen">{/* <Suspense>{children}</Suspense> */}</main>
    </div>
  );
}
