'use client';

import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task, User } from '@/prisma/client';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Eclipse } from 'react-svg-spinners';

import { Input } from '@/components/ui/input';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component

interface MemberEnrollmentProp extends Enrollment {
  user: User;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface InvitationTable {
  id: string;
  email: string;
  role: string;
  createdAt: string;
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
  const [ready, setReady] = useState(false);

  const [memberData, setMemberData] = useState<Member[]>([]);
  const [memberColumns, setMemberColumns] = useState([]);
  const [quickMemberFilter, setQuickMemberFilter] = useState('');

  const [invitationData, setInvitationData] = useState<InvitationTable[]>([]);
  const [invitationColumns, setInvitationColumns] = useState([]);
  const [quickInvitationFilter, setQuickInvitationFilter] = useState('');

  useEffect(() => {
    setMemberColumns([
      {
        field: 'id',
        headerName: 'ID',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true
      },
      { field: 'name' },
      { field: 'email' },
      { field: 'role' },
      { field: 'createdAt', headerName: 'Enrolled At' }
    ]);
    setInvitationColumns([
      {
        field: 'id',
        headerName: 'ID',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true
      },
      { field: 'email' },
      { field: 'role' },
      { field: 'createdAt', headerName: 'Invited At' }
    ]);

    // set data based on enrollments
    if (enrollments.length) {
      const members = enrollments.map((enrollment) => {
        return {
          id: enrollment.id,
          name: enrollment.user.name,
          email: enrollment.user.email,
          role: enrollment.manager ? 'Manager' : 'Member',
          createdAt: moment(enrollment.createdAt)
            .tz(school.timezone)
            .format('YYYY/MM/DD HH:mm:ss')
            .toString()
        };
      });
      setMemberData(members);
      const invitation = invitations.map((invitation) => {
        return {
          id: invitation.id,
          email: invitation.email,
          role: invitation.manager ? 'Manager' : 'Member',
          createdAt: moment(invitation.createdAt)
            .tz(school.timezone)
            .format('YYYY/MM/DD HH:mm:ss')
            .toString()
        };
      });
      setInvitationData(invitation);
    }
    setReady(true);
  }, [enrollments, invitations, school, setReady]);

  return (
    <div>
      <div className={(!ready ? '' : 'hidden ') + 'h-screen w-full'}>
        <Eclipse />
      </div>
      <div
        className={
          'flex flex-col gap-4 w-full h-screen overflow-auto p-12 ' +
          (!ready ? 'hidden' : '')
        }
      >
        <h1 className="text-4xl font-semibold">Invitations</h1>
        <Input
          type="text"
          placeholder="Search from members"
          onChange={(e) => setQuickInvitationFilter(e.target.value)}
        />
        <div className="w-full h-60 ag-theme-quartz">
          <AgGridReact
            rowData={invitationData}
            columnDefs={invitationColumns}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
            quickFilterText={quickInvitationFilter}
            pagination={true}
          />
        </div>{' '}
        <h1 className="text-4xl font-semibold">Members</h1>
        <Input
          type="text"
          placeholder="Search from members"
          onChange={(e) => setQuickMemberFilter(e.target.value)}
        />
        <div className="w-full h-96 ag-theme-quartz">
          <AgGridReact
            rowData={memberData}
            columnDefs={memberColumns}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
            quickFilterText={quickMemberFilter}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
}
