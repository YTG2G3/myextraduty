import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task } from '@prisma/client';

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
    <div className="p-12">
      <h1 className="font-semibold text-4xl mb-2">Settings</h1>
      <Separator />
      <div className="py-2">
        <Label htmlFor="school-name">School name</Label>
        <Input id="school-name" defaultValue={school.name} />
      </div>
    </div>
  );
}
