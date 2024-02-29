'use client';

import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task, User } from '@/prisma/client';
import { Eclipse } from 'react-svg-spinners';
import { create } from 'zustand';
import InvitationTable from './invitations';
import MemberTable from './members';

interface MemberTableState {
  ready: boolean;
  setReady: (ready: boolean) => void;
}

export const useMemberTable = create<MemberTableState>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready })
}));

interface InvitationTableState {
  ready: boolean;
  setReady: (ready: boolean) => void;
}

export const useInvitationTable = create<InvitationTableState>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready })
}));

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
  const memberReady = useMemberTable((state) => state.ready);
  const invitationReady = useInvitationTable((state) => state.ready);

  return (
    <div>
      <div
        className={
          (!memberReady || !invitationReady ? '' : 'hidden ') +
          'h-screen w-full'
        }
      >
        <Eclipse />
      </div>
      <div
        className={
          'flex flex-col gap-4 w-full h-screen overflow-auto p-12 ' +
          (!memberReady || !invitationReady ? 'hidden' : '')
        }
      >
        <h1 className="text-4xl font-semibold">Invitations</h1>
        <InvitationTable school={school} invitations={invitations} />
        <h1 className="text-4xl font-semibold">Members</h1>
        <MemberTable school={school} enrollments={enrollments} />
      </div>
    </div>
  );
}
