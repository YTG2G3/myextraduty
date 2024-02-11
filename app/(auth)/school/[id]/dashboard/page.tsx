import RoleRoute from '../role-route';
import User from './user';

export default async function Dashboard({
  params
}: {
  params: { id: string };
}) {
  return <RoleRoute id={params.id} user={User} manager={null} />;
}
