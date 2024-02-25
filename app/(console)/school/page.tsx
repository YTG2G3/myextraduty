import getServerSession from '@/lib/get-server-session';
import SchoolSelector from './school-selector';

export default async function SchoolInit() {
  const session = await getServerSession();

  const _schools = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    select: { school: true }
  });

  const schools = _schools.map((e) => e.school);

  return <SchoolSelector data={schools} />;
}
