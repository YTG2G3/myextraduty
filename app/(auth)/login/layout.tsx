import getServerSession from '@/lib/get-server-session';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = getServerSession(false);
  if (session) redirect('/school');

  return { children };
}
