import './globals.css';
import type { Metadata } from 'next';
import { bricolage, inter } from '../lib/fonts';
import RootProvider from '../components/utils/root-provider';
import getServerSession from '@/lib/get-server-session';

export const metadata: Metadata = {
  title: 'MyExtraDuty',
  description: 'An easy way to manage your extra duties. Powered by Algorix.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession(false);

  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="font-sans">
        <RootProvider session={session}>{children}</RootProvider>
      </body>
    </html>
  );
}
