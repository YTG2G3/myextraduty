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
import useClientSession from '@/lib/use-client-session';
import { Enrollment, School } from '@/prisma/client';
import { Separator } from '@radix-ui/react-separator';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Nav({
  data
}: {
  data: { enrollment: Enrollment; school: School }[];
}) {
  let session = useClientSession();
  let params = useParams<{ id: string }>();
  let [selectValue, setSelectValue] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    // if no id, redirect to the first school or boarding
    if (params?.id) setSelectValue(params.id);
    else if (data.length === 0) router.replace('/boarding');
    else {
      setSelectValue(data[0].school.id);
      router.replace(`/school/${data[0].school.id}/dashboard`);
    }
  }, [params, data, router]);

  function update(v: string) {
    setSelectValue(v);
    router.push(v === 'new' ? '/boarding' : `/school/${v}/dashboard`);
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
