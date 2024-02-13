'use client';

import { Invitation, School, User } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Check, ShieldCheck, X } from 'lucide-react';
import formatInt from '@/lib/formatInt';

export default function InvitationDialog({
  loadData,
  decide
}: {
  loadData: Function;
  decide: Function;
}) {
  let [isOpen, setIsOpen] = useState(false);

  let [invitations, setInvitations] = useState<Invitation[]>(undefined);
  let [schools, setSchools] = useState<School[]>(undefined);
  let [owners, setOwners] = useState<User[]>(undefined);

  let [decided, setDecided] = useState<boolean[]>(undefined);

  async function load() {
    let { invitations, schools, owners } = await loadData();

    if (invitations.length > 0) setIsOpen(true);
    else setIsOpen(false);

    setInvitations(invitations);
    setSchools(schools);
    setOwners(owners);

    setDecided(invitations.map(() => false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clientDecide(index: number, accept: boolean) {
    setDecided(decided.map((d, i) => (i === index ? true : d)));
    decide(
      invitations[index].id,
      schools[index].id,
      invitations[index].manager,
      accept
    );
  }

  // TODO - loading
  if (!invitations || !schools || !owners || !decided) return <></>;

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
                          <h4 className="text-sm w-36 font-semibold overflow-hidden truncate">
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
                              Invited {formatInt(invitations[i].createdAt)}
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
