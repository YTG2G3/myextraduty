'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useSearch } from '@/hooks/states';
import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task, User } from '@/prisma/client';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import HeaderWrapper from '../header-wrapper';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

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
  const [query, clearQuery] = useSearch((props) => [
    props.query,
    props.clearQuery
  ]);
  const [data, setData] = useState<Member[]>([]);
  const [memberColumns, setMemberColumns] = useState<ColumnDef<Member>[]>([]);

  useEffect(() => {
    clearQuery();
  }, [clearQuery]);

  const checkAllSelected = (table) => {
    return (
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && 'indeterminate')
    );
  };

  useEffect(() => {
    setMemberColumns([
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={checkAllSelected(table)}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-2">
              Name
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className="p-2"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        accessorKey: 'name'
      },
      {
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-2">
              Email
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className="p-2"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        accessorKey: 'email'
      },
      {
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-2">
              Role
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className="p-2"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        accessorKey: 'role'
      },
      {
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-2">
              Created At
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className="p-2"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        accessorKey: 'createdAt'
      },

      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    toast.success('User ID copied to clipboard');
                  }}
                >
                  Copy user ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Modify user</DropdownMenuItem>
                <DropdownMenuItem>
                  View user&apos;s assignments
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Remove user from school
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      }
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
      setData(members);
    }
  }, [enrollments, school]);

  // TODO - finish this based on proper logic to load member names
  return (
    <HeaderWrapper title="Members">
      <div className="flex flex-col gap-2">
        <div>menuarea</div>
        <DataTable columns={memberColumns} data={data} />
      </div>
    </HeaderWrapper>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
      sorting
    }
  });

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
