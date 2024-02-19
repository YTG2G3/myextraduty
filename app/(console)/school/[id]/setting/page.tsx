import prisma from '@/lib/db';
import RoleRoute from '../role-route';
import Manager from './manager';

export default async function Setting({ params }: { params: { id: string } }) {
  async function updateSchool(values) {
    'use server';

    try {
      await prisma.school.update({
        where: { id: params.id },
        data: values
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <RoleRoute
      id={params.id}
      user={null}
      manager={Manager}
      updateSchool={updateSchool}
    />
  );
}
