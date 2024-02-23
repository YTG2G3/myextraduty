import prisma from '@/lib/db';
import getServerSession from '@/lib/get-server-session';
import { redirect } from 'next/navigation';
import Redirect from './redirect';

// TODO - optimize
export default async function SchoolInit() {
  let session = await getServerSession();

  let enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id }
  });
  if (!enrollment) redirect('/school/new');

  let school = await prisma.school.findUnique({
    where: { id: enrollment.schoolId }
  });

  async function checkEnrollment(school_id: string) {
    'use server';
    let enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, schoolId: school_id }
    });
    return !!enrollment;
  }

  // Just in case localstorage has a previous record, client component is used
  return <Redirect id={school.id} check={checkEnrollment} />;
}
