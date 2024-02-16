import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task } from '@prisma/client';
import HeaderWrapper from '../header-wrapper';

// TODO - settings
export default function Manager({
  session,
  school,
  tasks,
  invitations,
  enrollments
}: {
  session: AuthSession;
  school: School;
  tasks: Task[];
  invitations: Invitation[];
  enrollments: Enrollment[];
}) {
  return (
    <HeaderWrapper title="Settings">
      <Label htmlFor="school-name">School name</Label>
      <Input id="school-name" defaultValue={school.name} />
    </HeaderWrapper>
  );
}
