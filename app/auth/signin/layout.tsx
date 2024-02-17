import getServerSession from '@/lib/get-server-session';
import { redirect } from 'next/navigation';

export default function LoginLayout({ children }) {
  const session = getServerSession();
  // if (session) {
  //   redirect("/school");
  // }

  return children;
}
