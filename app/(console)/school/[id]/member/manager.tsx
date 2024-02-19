'use client';

import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task } from '@prisma/client';
import HeaderWrapper from '../header-wrapper';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// TODO - manage members
export default function Manager({
  session,
  school,
  tasks,
  invitations,
  enrollments
}: {
  session: AuthSession;
  school: School[];
  tasks: Task[];
  invitations: Invitation[];
  enrollments: Enrollment[];
}) {
  let [target, setTarget] = useState(null);

  // TODO - finish this based on proper logic to load member names
  return (
    <HeaderWrapper title="Members">
      <Command>
        <CommandInput placeholder="Search member..." />
        <CommandEmpty>No timezone found.</CommandEmpty>
        <CommandGroup
          heading="Active Members"
          className="overflow-scroll overflow-x-hidden"
        >
          {enrollments.map((er) => (
            <CommandItem
              key={er.id}
              value={er.userId}
              onSelect={() => {
                setTarget(er.userId);
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  target === er.userId ? 'opacity-100' : 'opacity-0'
                )}
              />
              {er.userId}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </HeaderWrapper>
  );
}
