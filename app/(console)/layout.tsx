import getServerSession from '@/lib/get-server-session';

export default async function ConsoleLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await getServerSession();
  return <>{children}</>;
}
