'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import InvitationDialog from '@/components/utils/invitation-dialog';
import useClientSession from '@/lib/use-client-session';
import { Invitation, School, User } from '@/prisma/client';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SchoolSelectorData } from './page';

export default function SchoolSelector({
  data,
  invitations
}: {
  data: SchoolSelectorData[];
  invitations: { invitation: Invitation; school: School; owner: User }[];
}) {
  const session = useClientSession();

  function getSchoolRole(schoolId: string) {
    const target_enrollment = data.find((x) => x.school.id === schoolId);
    if (target_enrollment.school.ownerId === session.user.id) return 'Owner';
    else if (target_enrollment.manager) return 'Manager';
    else return 'Member';
  }

  return (
    <div className="w-screen">
      <div className="flex flex-col justify-around items-center h-screen">
        <div className="font-grotesque text-3xl font-semibold">
          Select school to continue
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          {data.length > 0 ? (
            <div className="flex gap-4 flex-wrap items-center justify-center px-8">
              {data.map((enrollment) => (
                <div
                  key={enrollment.school.id}
                  className={'flex flex-col items-center justify-center gap-2'}
                >
                  <span className="text-muted-foreground text-sm font-grotesque font-semibold">
                    {getSchoolRole(enrollment.school.id)}
                  </span>
                  <Link
                    href={`/school/${enrollment.school.id}/dashboard`}
                    className="rounded-lg p-4 shadow-md hover:shadow-xl cursor-pointer duration-300"
                  >
                    <Image
                      src={enrollment.school.image}
                      alt={`${enrollment.school.name} logo`}
                      width={150}
                      height={150}
                      priority={true}
                    />
                  </Link>
                  <span>{enrollment.school.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              No school is available. Create a new school.
            </div>
          )}
          {invitations.length > 0 && (
            <Dialog>
              <DialogTrigger
                className="text-muted-foreground text-sm mt-6"
                asChild
              >
                <Button
                  variant="outline"
                  style={{ borderColor: 'var(--color-muted-foreground)' }}
                >
                  {invitations.length} pending invitation
                  {invitations.length > 1 ? 's' : ''}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <InvitationDialog data={invitations} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <Link href="/boarding" className={navigationMenuTriggerStyle()}>
          <span className="flex gap-2 items-center text-muted-foreground text-sm">
            <Plus className="w-4 h-4" />
            Create a new school
          </span>
        </Link>
      </div>
    </div>
  );
}
