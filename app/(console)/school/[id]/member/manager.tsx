'use client';

import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task, User } from '@/prisma/client';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import inviteMember from '@/lib/actions/invite-member';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import { AgGridReact } from 'ag-grid-react';
import { MoreHorizontal, Search, SendHorizonal, X } from 'lucide-react';
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

  const [memberData, setMemberData] = useState<Member[]>([]);
  const [invitationData, setInvitationData] = useState<InvitationTable[]>([]);

  const [selectedMember, setSelectedMember] = useState<Member[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<
    InvitationTable[]
  >([]);

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
              <InviteDialog />
            </div>
          )}
          <div className="w-full h-60 ag-theme-quartz">
            <AgGridReact<InvitationTable>
              rowData={invitationData}
              columnDefs={invitationColumns}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              onGridReady={(params) => {
                onInvitationGridReady();
                params.api.sizeColumnsToFit();
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
          <div className="w-full h-96 ag-theme-quartz">
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

function InvitationAction() {
  return (
    <div className="flex justify-center items-center h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MemberAction(props) {
  const school = SchoolState((state) => state.school);
  const [disabled, setDisabled] = useState(false);
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

  return (
    <div className="flex justify-center items-center h-full w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{props.data.name}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
            {assignmentCount} of {school.quota} required assigned
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(props.data.id);
              toast.success('User ID copied to clipboard');
            }}
          >
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Modify user</DropdownMenuItem>
          <DropdownMenuItem>View user&apos;s assignments</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            Remove user from school
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function InviteDialog() {
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleInvite = async () => {
    setDisabled(true);
    toast.loading('Inviting user...', { id: 'invite' });
    const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailregex.test(email)) {
      toast.error('Email is invalid.', { id: 'invite' });
      setDisabled(false);
      return;
    }
    try {
      await inviteMember(SchoolState.getState().school.id, email);
      toast.success('User invited.', { id: 'invite' });
    } catch (e) {
      if (e instanceof Error) toast.error(e.message);
      else toast.error('Failed to invite user.', { id: 'invite' });
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex flex-row gap-2">
          <SendHorizonal /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Put in the email address of the person you want to invite.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Email
            </Label>
            <Input
              value={email}
              id="email"
              placeholder="mingeon.kim@algorix.io"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              disabled={disabled}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="w-full flex flex-col items-end">
            <div>
              <DialogClose asChild>
                <Button variant="outline" className="mr-2" disabled={disabled}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => handleInvite()}
                className="mt-2"
                disabled={disabled}
              >
                Invite
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
