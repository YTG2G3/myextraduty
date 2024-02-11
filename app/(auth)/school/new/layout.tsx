import getServerSession from '@/lib/get-server-session';
import FormRefProvider from './form-ref-provider';
import Nav from './nav';
import prisma from '@/lib/db';

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
      <div className="flex w-full h-full justify-center items-center">
        <div className="min-w-[40%] flex flex-col">
          {children}

          <Nav complete={complete} />
        </div>
      </div>
    </FormRefProvider>
  );
}
