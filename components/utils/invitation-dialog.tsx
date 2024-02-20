'use client';

import useClientSession from '@/lib/use-client-session';
import { Invitation, School, User } from '@/prisma/client';
import { CalendarDays, Check, ShieldCheck, X } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';

export default function InvitationDialog() {
  const session = useClientSession();
  const [isOpen, setIsOpen] = useState(false);

  const [invitations, setInvitations] = useState<Invitation[]>(undefined);
  const [schools, setSchools] = useState<School[]>(undefined);
  const [owners, setOwners] = useState<User[]>(undefined);

  const [decided, setDecided] = useState<boolean[]>(undefined);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    let data = await (await fetch(`/invitation/${session.user.email}`)).json();

    if (invitations.length > 0) setIsOpen(true);
    else setIsOpen(false);

    setInvitations(data.map((v) => v.invitation));
    setSchools(data.map((v) => v.school));
    setOwners(data.map((v) => v.owner));

    setDecided(invitations.map(() => false));
  }

  // TODO - disable the buttons and loading
  async function clientDecide(index: number, accept: boolean) {
    setLoading(true);
    let res = await (
      await fetch('/invitation', {
        method: 'POST',
        body: JSON.stringify({ id: invitations[index].id, accept })
      })
    ).json();

    if (res.error) toast.error(res.error);
    else setDecided(decided.map((d, i) => (i === index ? true : d)));

    setLoading(false);
  }

  if (!invitations || !schools || !owners || !decided) return undefined;

  return (
    <TooltipProvider>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have been invited!</AlertDialogTitle>

            <AlertDialogDescription>
              {invitations.length} school(s) invited you to join them. You can
              accept or decline the invitation by selecting an option below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex !flex-col">
            {schools.map((school, i) =>
              !decided[i] ? (
                <div
                  key={i}
                  className="!m-0 grid items-center"
                  style={{ gridTemplateColumns: '1fr auto' }}
                >
                  <HoverCard>
                    <HoverCardTrigger className="overflow-hidden">
                      <p className="cursor-pointer truncate">{school.name}</p>
                    </HoverCardTrigger>

                    <HoverCardContent align="start" className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage src={school.image} />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                          <h4 className="w-36 overflow-hidden truncate text-sm font-semibold">
                            {school.name}
                          </h4>

                          <p className="text-sm">
                            Invited as a{' '}
                            {invitations[i].manager ? 'manager' : 'member'}.
                            Owned by {owners[i].name}.
                          </p>

                          <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                            <span className="text-xs text-muted-foreground">
                              Invited{' '}
                              {moment(invitations[i].createdAt).format('LL')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => clientDecide(i, true)}
                          disabled={loading}
                        >
                          {invitations[i].manager ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>
                        {invitations[i].manager
                          ? 'Accept as Manager'
                          : 'Accept'}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => clientDecide(i, false)}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>Reject</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ) : undefined
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
