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
import { Invitation, School } from '@/prisma/client';
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

interface InvitationTable {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

// TODO - manage members
export default function InvitationTable({
  school,
  invitations
}: {
  school: School;
  invitations: Invitation[];
}) {
  const [data, setData] = useState<InvitationTable[]>([]);
  const [columns, setColumns] = useState<ColumnDef<InvitationTable>[]>([]);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const checkAllSelected = (table) => {
    return (
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && 'indeterminate')
    );
  };

  useEffect(() => {
    setColumns([
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
              Invited At
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
          const invitation = row.original;

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
                    navigator.clipboard.writeText(invitation.id);
                    toast.success('Invitation ID copied to clipboard');
                  }}
                >
                  Copy invitation ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Resend invitation</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Cancel invitation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      }
    ]);
    // set data based on enrollments
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
      setData(invitation);
    }
  }, [invitations, school]);

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

  // TODO - finish this based on proper logic to load member names
  return (
    <div className="flex flex-col gap-2">
      <div>invitationmenuarea</div>
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
