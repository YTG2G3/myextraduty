'use client';

import { invitationDecide } from '@/lib/actions/invitation-decide';
import { Invitation, School, User } from '@/prisma/client';
import { CalendarDays, Check, ShieldCheck, X } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import { toast } from 'sonner';
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

export default function InvitationDialog({
  data
}: {
  data: { invitation: Invitation; school: School; owner: User }[];
}) {
  const [decision, setDecision] = useState<boolean[]>(
    data.map(() => undefined)
  ); // decided: true, undecided: false
  const [loading, setLoading] = useState(false);

  async function clientDecide(index: number, accept: boolean) {
    setLoading(true);
    let res = await invitationDecide(data, index, accept);
    if (!res) return toast.error('An error occurred. Please try again.');

    setDecision(decision.map((d, i) => (i === index ? accept : d)));
    setLoading(false);
  }

  return (
    <div className="gap-2 px-2">
      <div>
        <h1 className="text-xl font-grotesque">You have been invited!</h1>

        <span className="text-muted-foreground text-sm">
          {data.length} school(s) invited you to join them. You can accept or
          decline the invitation by selecting an option below.
        </span>
      </div>

      <div className="flex !flex-col">
        <TooltipProvider>
          {data.map((d, i) => (
            <div
              key={d.school.id}
              className="grid items-center !mb-0 !ml-0 !mr-0 !mt-2"
              style={{ gridTemplateColumns: '1fr auto' }}
            >
              <HoverCard openDelay={200}>
                <HoverCardTrigger className="overflow-hidden">
                  <p className="cursor-pointer truncate">{d.school.name}</p>
                </HoverCardTrigger>

                <HoverCardContent align="start" className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src={d.school.image} />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h4 className="w-36 overflow-hidden truncate text-sm font-semibold">
                        {d.school.name}
                      </h4>

                      <p className="text-sm">
                        Invited as a{' '}
                        {d.invitation.manager ? 'manager' : 'member'}. Owned by{' '}
                        {d.owner.name}.
                      </p>

                      <div className="flex items-center pt-2">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                        <span className="text-xs text-muted-foreground">
                          Invited {moment(d.invitation.createdAt).format('LL')}
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
                        {d.invitation.manager ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      {d.invitation.manager ? 'Accept as Manager' : 'Accept'}
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
        </TooltipProvider>
      </div>
    </div>
  );
}
