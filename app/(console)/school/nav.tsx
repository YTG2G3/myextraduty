'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import boardingSteps from '@/lib/boarding-steps';
import useClientSession from '@/lib/use-client-session';
import { Enrollment, School } from '@/prisma/client';
import { Separator } from '@radix-ui/react-separator';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// TODO - prettier margin for navigator and fix avatar weird margin, add a logout button
export default function Nav({
  data
}: {
  data: { enrollment: Enrollment; school: School }[];
}) {
  let session = useClientSession();
  let params = useParams<{ id: string }>();
  let [selectValue, setSelectValue] = useState('new');
  const router = useRouter();

  useEffect(() => {
    // if no id, redirect to the first school
    if (params?.id) setSelectValue(params.id);
    else
      router.replace(
        `/school/${data.length > 0 ? data[0].school.id + '/dashboard' : 'new'}`
      );
  }, [params, data, router]);

  function update(v: string) {
    setSelectValue(v);
    router.push(v === 'new' ? '/school/new' : `/school/${v}/dashboard`);
  }

  return (
    <nav
      className="grid h-screen w-72 gap-2 bg-gray-800 p-6"
      style={{ gridTemplateRows: 'auto auto 1fr auto' }}
    >
      <Select value={selectValue} onValueChange={update}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="new">Create a new school</SelectItem>

          {data.find((d) => d.school.ownerId === session.user.id) && (
            <SelectGroup>
              <SelectLabel>Owner</SelectLabel>

              {data
                .filter((d) => d.school.ownerId === session.user.id)
                .map((d, i) => (
                  <SelectItem key={i} value={d.school.id}>
                    {d.school.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          )}

          {data.find(
            (d, i) =>
              d.enrollment.manager && d.school.ownerId !== session.user.id
          ) && (
            <SelectGroup>
              <SelectLabel>Manager</SelectLabel>

              {data
                .filter(
                  (d, i) =>
                    d.enrollment.manager && d.school.ownerId !== session.user.id
                )
                .map((d, i) => (
                  <SelectItem key={i} value={d.school.id}>
                    {d.school.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          )}

          {data.find((d) => !d.enrollment.manager) && (
            <SelectGroup>
              <SelectLabel>Member</SelectLabel>

              {data
                .filter((d) => !d.enrollment.manager)
                .map((d, i) => (
                  <SelectItem key={i} value={d.school.id}>
                    {d.school.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>

      <Separator className="display-none" />

      {params.id ? (
        <div className="flex flex-col">
          <NavItem to="dashboard">Dashboard</NavItem>
          <NavItem to="task">Tasks</NavItem>
          <NavItem to="alert">Alerts</NavItem>

          {data.find((d) => d.school.id === params.id).enrollment.manager ? (
            <>
              <Separator className="h-[2px] bg-white opacity-15" />
              <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
                Manager Only
              </p>

              <NavItem to="member">Members</NavItem>
              <NavItem to="report">Reports</NavItem>
              <NavItem to="setting">Settings</NavItem>
            </>
          ) : undefined}
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          {boardingSteps.map((s, i) => (
            <StepItem key={i} to={s.to}>
              {s.name}
            </StepItem>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center overflow-hidden">
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>

        <div className="ml-3 overflow-hidden text-white">
          <p className="truncate">{session.user.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {session.user.email}
          </p>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  let pathname = usePathname();
  if (!pathname) return <></>;

  let path = pathname.substring(pathname.lastIndexOf('/') + 1);
  let pathway = pathname.substring(0, pathname.lastIndexOf('/'));

  return (
    <Button
      asChild
      variant="ghost"
      className={`mb-3 text-white ${path === to ? 'bg-white font-bold text-foreground' : 'font-normal'}`}
    >
      <Link href={`${pathway}/${to}`}>{children}</Link>
    </Button>
  );
}

function StepItem({ to, children }: { to: string; children: React.ReactNode }) {
  let pathname = usePathname();
  if (!pathname) return <></>;

  // TODO - enable the one that is already complete using sessionStorage (ex. if saved 2, come back to 1, then 2 should still be clickable)

  let path = pathname.substring(pathname.lastIndexOf('/') + 1);
  let index_path = boardingSteps.findIndex((s) => s.to === path);
  let index_to = boardingSteps.findIndex((s) => s.to === to);

  return (
    <div className="flex items-center">
      <p
        className={`flex h-8 w-8 select-none items-center justify-center rounded-full border-2 text-lg ${index_path >= index_to ? 'border-solid border-white text-white' : 'border-dotted border-muted-foreground text-muted-foreground'}`}
      >
        {index_to}
      </p>

      <Button
        asChild
        variant="link"
        className={`text-white ${index_path < index_to ? 'pointer-events-none text-muted-foreground' : ''} font-normal`}
      >
        <Link href={`/school/new/${to}`}>{children}</Link>
      </Button>
    </div>
  );
}
