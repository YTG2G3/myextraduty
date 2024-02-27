import HeaderWrapper from '../header-wrapper';
import RoleRoute from '../role-route';
import User from './user';

export default async function Alert({ params }: { params: { id: string } }) {
  return (
    <HeaderWrapper title="Alerts">
      <RoleRoute id={params.id} user={User} manager={null} />
    </HeaderWrapper>
  );
}
