import prisma from '@/lib/db';
import getServerSession from '@/lib/get-server-session';
import { Suspense } from 'react';
import FormRefProvider from './form-ref-provider';
import Nav from './nav';

export default async function NewSchoolLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession();

  async function complete({
    timezone,
    name,
    image,
    openingAt,
    quota,
    maxAssigned,
    dropEnabled,
    code
  }) {
    'use server';

    if (code !== 'huskies') return null;

    try {
      let s = await prisma.school.create({
        data: {
          ownerId: session.user.id,
          name,
          image,
          timezone,
          openingAt,
          quota,
          maxAssigned,
          dropEnabled
        }
      });

      await prisma.enrollment.create({
        data: {
          manager: true,
          schoolId: s.id,
          userId: session.user.id
        }
      });

      return s.id;
    } catch (error) {
      return null;
    }
  }

  return (
    <FormRefProvider>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex min-w-[40%] flex-col">
          <Suspense>{children}</Suspense>

          <Nav complete={complete} />
        </div>
      </div>
    </FormRefProvider>
  );
}
