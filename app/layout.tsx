import RootProvider from '@/components/utils/root-provider';
import { ThemeProvider } from '@/components/utils/theme-provider';
import { bricolage, inter } from '@/lib/fonts';
import getServerSession from '@/lib/get-server-session';
import type { Metadata } from 'next';
import './globals.css';

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
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider defaultTheme="light" attribute="class">
          <RootProvider session={session}>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
