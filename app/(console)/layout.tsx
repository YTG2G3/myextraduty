import InvitationDialog from '@/components/utils/invitation-dialog';

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <InvitationDialog />

      {children}
    </>
  );
}
