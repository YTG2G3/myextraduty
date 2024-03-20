'use client';

import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task, User } from '@/prisma/client';
import moment from 'moment-timezone';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import cancelInvitation from '@/lib/actions/cancel-invitation';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import { AgGridReact } from 'ag-grid-react';
import { Download, MoreHorizontal, Search, Send, Trash, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { create } from 'zustand';

interface ISchoolState {
  school: School;
  setSchool: (school: School) => void;
}

const SchoolState = create<ISchoolState>((set) => ({
  school: null,
  setSchool: (school) => set({ school })
}));

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
  const setSchool = SchoolState((state) => state.setSchool);
  const { theme } = useTheme();
  const router = useRouter();

  const [memberData, setMemberData] = useState<Member[]>([]);
  const [invitationData, setInvitationData] = useState<InvitationTable[]>([]);

  const [selectedMember, setSelectedMember] = useState<Member[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<
    InvitationTable[]
  >([]);

  const memberSelected = useMemo<boolean>(
    () => !!(selectedMember.length === 0),
    [selectedMember]
  );
  const invitationSelected = useMemo<boolean>(
    () => !!(selectedInvitation.length === 0),
    [selectedInvitation]
  );

  const [quickMemberFilter, setQuickMemberFilter] = useState('');
  const [quickInvitationFilter, setQuickInvitationFilter] = useState('');

  const [isMemberSearching, setIsMemberSearching] = useState(false);
  const [isInvitationSearching, setIsInvitationSearching] = useState(false);

  const [memberColumns] = useState<ColDef[]>([
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
    { field: 'createdAt', headerName: 'Enrolled At' },
    {
      headerName: '',
      cellRenderer: MemberAction,
      colId: 'action',
      editable: false,
      minWidth: 40,
      maxWidth: 40
    }
  ]);
  const [invitationColumns] = useState<ColDef[]>([
    {
      field: 'id',
      headerName: 'ID',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true
    },
    { field: 'email' },
    { field: 'role' },
    { field: 'createdAt', headerName: 'Invited At' },
    {
      headerName: '',
      cellRenderer: InvitationAction,
      colId: 'action',
      editable: false,
      minWidth: 40,
      maxWidth: 40
    }
  ]);

  const onMemberGridReady = () => {
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
    }
  };

  const onInvitationGridReady = () => {
    if (invitations.length) {
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
  };

  const invitationDownload = () => {
    // id, email, role, createdAt
    // change createdat to school timezone
    const csv = invitationData.map((invitation) => {
      return `${invitation.id},${invitation.email},${invitation.role},${moment.tz(invitation.createdAt, school.timezone).format('YYYY/MM/DD HH:mm:ss')}`;
    });
    let csvData = csv.join('\n');
    csvData = 'id,email,role,createdAt\n' + csvData;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const time = moment().tz(school.timezone).format('YYYY-MM-DD-HH-mm-ss');
    a.download = `invitations-${time}.csv`;
    a.click();
    toast.success('Invitations downloaded', { id: 'download-invitations' });
    // cleanup
    window.URL.revokeObjectURL(url);
  };

  const invitationBulkCancel = async () => {
    toast.loading('Cancelling invitations', { id: 'bulk-cancel' });
    let failcount = 0;
    for (const inv of selectedInvitation) {
      try {
        await cancelInvitation(school.id, inv.email);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            `Failed to cancel invitation to ${inv.email}: ${error.message}`
          );
        } else {
          toast.error(`Failed to cancel invitation to ${inv.email}`);
        }
        failcount++;
      }
    }
    toast.success(
      `Cancelled ${selectedInvitation.length - failcount} invitations`,
      { id: 'bulk-cancel' }
    );
    router.refresh();
  };

  useEffect(() => {
    setSchool(school);
  }, [school, setSchool]);

  return (
    <div>
      <div className="flex flex-col gap-4 w-full h-screen overflow-auto p-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">Invitations</h1>
          {isInvitationSearching ? (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setQuickInvitationFilter('');
                  setIsInvitationSearching(false);
                }}
              >
                <X />
              </Button>
              <Input
                type="text"
                placeholder="Search from invitations"
                onChange={(e) => setQuickInvitationFilter(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsInvitationSearching(true)}
                className="flex"
              >
                <Search />
              </Button>
              <Link href={`/school/${school.id}/member/invite`}>
                <Button variant="outline" className="flex flex-row gap-2">
                  <Send />
                  Invite
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex flex-row gap-2"
                disabled={invitationSelected}
                onClick={invitationDownload}
              >
                <Download />
                Download
              </Button>
              <Button
                variant="destructive"
                className="flex flex-row gap-2"
                disabled={invitationSelected}
                onClick={invitationBulkCancel}
              >
                <Trash />
                Cancel invitation
              </Button>
            </div>
          )}
          <div
            className={`w-full h-60 ${theme === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'}`}
          >
            <AgGridReact<InvitationTable>
              rowData={invitationData}
              columnDefs={invitationColumns}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              onGridReady={(params) => {
                onInvitationGridReady();
                params.api.sizeColumnsToFit();
              }}
              onSelectionChanged={(params) => {
                setSelectedInvitation(params.api.getSelectedRows());
              }}
              quickFilterText={quickInvitationFilter}
              suppressHorizontalScroll={true}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">Members</h1>
          {isMemberSearching ? (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setQuickInvitationFilter('');
                  setIsMemberSearching(false);
                }}
              >
                <X />
              </Button>
              <Input
                type="text"
                placeholder="Search from members"
                onChange={(e) => setQuickMemberFilter(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsMemberSearching(true)}
                className="flex"
              >
                <Search />
              </Button>
            </div>
          )}
          <div
            className={`w-full h-96 ${theme === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'}`}
          >
            <AgGridReact<Member>
              rowData={memberData}
              columnDefs={memberColumns}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              onGridReady={(params) => {
                onMemberGridReady();
                params.api.sizeColumnsToFit();
              }}
              onSelectionChanged={(params) => {
                setSelectedMember(params.api.getSelectedRows());
              }}
              quickFilterText={quickMemberFilter}
              suppressHorizontalScroll={true}
            />
          </div>
          {selectedMember.length !== 0 && (
            <div style={{ marginTop: '-8px' }}>
              <div className="text-muted-foreground font-light">
                {selectedMember.length} member
                {selectedMember.length > 1 ? 's' : ''} selected
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvitationAction(props) {
  const school = SchoolState((state) => state.school);
  const router = useRouter();

  const cancelInv = async () => {
    toast.loading('Cancelling invitation', { id: props.data.id + '-cancel' });
    try {
      await cancelInvitation(school.id, props.data.email);
      toast.success('Invitation cancelled', { id: props.data.id + '-cancel' });
      router.refresh();
    } catch (error) {
      toast.error('Failed to cancel invitation', {
        id: props.data.id + '-cancel'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive-foreground justify-end"
            onClick={cancelInv}
          >
            Cancel invitation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MemberAction(props) {
  const school = SchoolState((state) => state.school);
  const [assignmentCount, setAssignmentCount] = useState(0);
  // props.data.id // get row_id

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `/school/${school.id}/member/${props.data.id}/assignments`
      );
      const json = await data.json();
      console.log(json);
      setAssignmentCount(json.count);
    };

    fetchData();
  }, [school.id, props.data.id]);

  const removeMember = async () => {
    console.log('remove member');
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-right">
          <DropdownMenuLabel>{props.data.name}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
            {assignmentCount} of {school.quota} required assigned
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-end"
            onClick={() => {
              navigator.clipboard.writeText(props.data.id);
              toast.success('User ID copied to clipboard');
            }}
          >
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-end">
            <Link
              href={`/school/${school.id}/member/${props.data.id}`}
              className="w-full"
            >
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive-foreground justify-end">
            Remove user from school
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
