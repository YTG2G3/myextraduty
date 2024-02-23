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

  const [decision, setDecision] = useState<boolean[]>(undefined);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (decision && decision.every((d) => d !== undefined)) {
      setTimeout(() => {
        setIsOpen(false);
      }, 700);
    }
  }, [decision]);

  async function load() {
    let data;
    try {
      data = await fetch(`/invitation/${session.user.email}`);
    } catch {
      toast.error('An error occurred while fetching invitations.');
      return;
    } finally {
      if (data.status !== 200) {
        toast.error('An error occurred while fetching invitations.');
        return;
      }
      data = await data.json();
    }

    if (data.length > 0) setIsOpen(true);
    else setIsOpen(false);

    setInvitations(data.map((v) => v.invitation));
    setSchools(data.map((v) => v.school));
    setOwners(data.map((v) => v.owner));

    setDecision(data.map(() => undefined));
  }

  async function clientDecide(index: number, accept: boolean) {
    setLoading(true);

    let res = await (
      await fetch('/invitation', {
        method: 'POST',
        body: JSON.stringify({ id: invitations[index].id, accept })
      })
    ).json();

    if (res.status !== 200) toast.error('An error occurred. Please try again.');
    else {
      const newDecision = [...decision];
      newDecision[index] = accept;
      setDecision(newDecision);
      console.log(newDecision);
    }
    setLoading(false);
  }

  if (!invitations || !schools || !owners || !decision) return undefined;

  return (
    <TooltipProvider>
      <AlertDialog open={isOpen}>
        <AlertDialogContent className="gap-2">
          <AlertDialogHeader>
            <AlertDialogTitle>You have been invited!</AlertDialogTitle>

            <AlertDialogDescription>
              {invitations.length} school(s) invited you to join them. You can
              accept or decline the invitation by selecting an option below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex !flex-col">
            {schools.map((school, i) => (
              <div
                key={i}
                className="grid items-center !mb-0 !ml-0 !mr-0 !mt-2"
                style={{ gridTemplateColumns: '1fr auto' }}
              >
                <HoverCard openDelay={200}>
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
                          {invitations[i].manager ? 'manager' : 'member'}. Owned
                          by {owners[i].name}.
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
                {decision[i] === undefined ? (
                  <div>
                    <Tooltip delayDuration={0} disableHoverableContent>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full mr-2 w-8 h-8"
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

                    <Tooltip delayDuration={0} disableHoverableContent>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full w-8 h-8"
                          onClick={() => clientDecide(i, false)}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>Reject</TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="h-8 text-sm flex items-center">
                    {decision[i] ? (
                      <div className="text-green-600">Accepted</div>
                    ) : (
                      <div className="text-red-600">Rejected</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
