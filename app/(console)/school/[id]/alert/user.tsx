import AuthSession from '@/lib/auth-session';
import { School, Task } from '@/prisma/client';

// TODO - stacked alerts
export default function User({
  session,
  school,
  tasks
}: {
  session: AuthSession;
  school: School[];
  tasks: Task[];
}) {
  return (
    <div>
      <h1>Alert</h1>
    </div>
  );
}
