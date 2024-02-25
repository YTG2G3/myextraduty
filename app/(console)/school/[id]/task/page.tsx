import HeaderWrapper from '../header-wrapper';
import RoleRoute from '../role-route';
import Manager from './manager';
import User from './user';

export default async function Task({ params }: { params: { id: string } }) {
  return (
    <HeaderWrapper title="Tasks">
      <RoleRoute id={params.id} user={User} manager={Manager} />
    </HeaderWrapper>
  );
}
