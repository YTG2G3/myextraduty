'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useClientSession from '@/lib/use-client-session';
import { Enrollment, School } from '@/prisma/client';
import { Separator } from '@radix-ui/react-separator';
import {
  Bell,
  ChevronLeftIcon,
  ClipboardPenLine,
  Cog,
  LayoutDashboard,
  ListTodo,
  Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavClient({
  data
}: {
  data: { enrollment: Enrollment; school: School };
}) {
  let session = useClientSession();

  return (
    <nav
      className="grid h-screen w-72 gap-2 bg-gray-200 border-r-2 border-gray-300 p-6"
      style={{ gridTemplateRows: 'auto auto 1fr auto' }}
    >
      <div className="mb-2">
        <Link
          href="/school"
          className="flex text-sm text-muted-foreground hover:underline hover:text-black items-center gap-1"
        >
          <ChevronLeftIcon size={15} />
          Select another school
        </Link>
        <div className="mt-3 flex gap-4">
          <Image
            src={data.school.image}
            alt={`${data.school.name} logo`}
            width={80}
            height={80}
            className="rounded-md shadow-md"
          />
          <span>{data.school.name}</span>
        </div>
      </div>

      <Separator className="display-none" />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 ml-1">
          <NavItem to="dashboard" name="Dashboard" icon={<LayoutDashboard />} />
          <NavItem to="task" name="Tasks" icon={<ListTodo />} />
          <NavItem to="alert" name="Alerts" icon={<Bell />} />
        </div>

        {data.enrollment.manager ? (
          <>
            <Separator className="h-[1.5px] bg-black opacity-15" />
            <p className="text-sm ml-1">Manager Only</p>
            <div className="ml-1 flex flex-col gap-4">
              <NavItem to="member" name="Members" icon={<Users />} />
              <NavItem to="report" name="Reports" icon={<ClipboardPenLine />} />
              <NavItem to="setting" name="Settings" icon={<Cog />} />
            </div>
          </>
        ) : undefined}
      </div>

      <div className="flex items-center justify-center overflow-hidden">
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>

        <div className="ml-3 overflow-hidden">
          <p className="truncate">{session.user.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {session.user.email}
          </p>
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  to,
  icon,
  name
}: {
  to: string;
  icon: React.ReactNode;
  name: string;
}) {
  let pathname = usePathname();
  if (!pathname) return <></>;

  let path = pathname.substring(pathname.lastIndexOf('/') + 1);
  let pathway = pathname.substring(0, pathname.lastIndexOf('/'));

  return (
    <Link
      className={
        'hover:underline hover:text-black text-muted-foreground flex items-center gap-1'
      }
      href={`${pathway}/${to}`}
    >
      <span
        className={path === to ? 'text-black' : ''}
        style={{ transform: 'scale(0.7)' }}
      >
        {icon}
      </span>
      <span className={path === to ? 'text-black' : ''}>{name}</span>
    </Link>
  );
}
