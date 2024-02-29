'use client';

import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task, User } from '@/prisma/client';
import InvitationTable from './invitations';
import MemberTable from './members';

interface MemberEnrollmentProp extends Enrollment {
  user: User;
}

// TODO - manage members
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
  enrollments: MemberEnrollmentProp[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-screen overflow-auto p-12">
      <h1 className="text-4xl font-semibold">Invitations</h1>
      <InvitationTable school={school} invitations={invitations} />
      <h1 className="text-4xl font-semibold">Members</h1>
      <MemberTable school={school} enrollments={enrollments} />
    </div>
  );
}
