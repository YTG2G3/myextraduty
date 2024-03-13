'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useClientSession from '@/lib/use-client-session';
import { Enrollment, School } from '@/prisma/client';
import { Separator } from '@radix-ui/react-separator';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardPenLine,
  Cog,
  LayoutDashboard,
  ListTodo,
  Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { create } from 'zustand';

interface INavState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navState = create<INavState>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed })
}));

export default function NavClient({
  data
}: {
  data: { enrollment: Enrollment; school: School };
}) {
  const session = useClientSession();
  const [collapsed, setCollapsed] = navState((state) => [
    state.collapsed,
    state.setCollapsed
  ]);

  return (
    <Nav
      $collapsed={collapsed}
      className="grid h-screen gap-2 bg-secondary p-6 pr-2"
      style={{ gridTemplateRows: 'auto auto 1fr auto' }}
    >
      <div className="m-2 mb-1">
        <Link
          href="/school"
          className={`flex text-sm text-muted-foreground hover:underline hover:text-black items-center gap-1
                      ${collapsed ? 'justify-center' : ''}`}
        >
          <ChevronLeft size={collapsed ? 18 : 15} />
          {collapsed ? '' : 'Select another school'}
        </Link>
        <div className="mt-4 flex gap-4 items-center">
          <Image
            src={data.school.image}
            alt={`${data.school.name} logo`}
            width={30}
            height={30}
            className="rounded-md shadow-md"
            priority={true}
          />
          <span className="text-sm text-muted-foreground">
            {data.school.name}
          </span>
        </div>
      </div>

      <Separator className="display-none" />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <NavItem to="dashboard" name="Dashboard" icon={<LayoutDashboard />} />
          <NavItem to="task" name="Tasks" icon={<ListTodo />} />
          <NavItem to="alert" name="Alerts" icon={<Bell />} />
        </div>

        {data.enrollment.manager ? (
          <>
            <Separator className="h-[1.5px] bg-black opacity-15" />
            {collapsed ? '' : <p className="text-sm ml-3">Manager Only</p>}
            <div className="flex flex-col gap-1">
              <NavItem to="member" name="Members" icon={<Users />} />
              <NavItem to="report" name="Reports" icon={<ClipboardPenLine />} />
              <NavItem to="setting" name="Settings" icon={<Cog />} />
            </div>
          </>
        ) : undefined}
      </div>

      <div className="flex flex-col gap-1 font-medium">
        <div
          className={`flex items-center overflow-hidden p-3 hover:bg-gray-200 ${collapsed ? 'rounded-full' : 'rounded-md'}`}
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src={session.user.image} />
            <AvatarFallback>{session.user.name}</AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden">
            <p className="truncate">{!collapsed ? session.user.name : <></>}</p>
          </div>
        </div>
        <div
          className={`flex flex-row gap-3 p-3 hover:bg-gray-200 cursor-default ${collapsed ? 'rounded-full' : 'rounded-md'}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
          {collapsed ? '' : 'Collapse'}
        </div>
      </div>
    </Nav>
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
  const pathname = usePathname();
  const collapsed = navState((state) => state.collapsed);

  let pathway = pathname.substring(0, pathname.lastIndexOf('/'));

  const [active, setActive] = useState(
    pathname.substring(pathname.lastIndexOf('/') + 1) === to
  );

  useEffect(() => {
    const path = pathname.substring(pathname.lastIndexOf('/') + 1);
    setActive(path === to);
  }, [pathname, setActive, to]);

  if (collapsed) {
    return (
      <Link href={`${pathway}/${to}`} className="flex items-center">
        <div
          className={`flex items-center hover:bg-gray-200 text-muted-foreground rounded-full p-3 ${active ? 'bg-gray-200' : ''}`}
        >
          <span className={active ? 'text-black' : ''}>{icon}</span>
        </div>
      </Link>
    );
  } else {
    return (
      <Link href={`${pathway}/${to}`} className="flex items-center w-full">
        <div
          className={`flex items-center hover:bg-gray-200 text-muted-foreground rounded-md p-3 w-full ${active ? 'bg-gray-200' : ''}`}
        >
          <span className={active ? 'text-black' : ''}>{icon}</span>
          <span className="ml-3 overflow-hidden font-medium">
            <p className={active ? 'text-black' : ''}>{name}</p>
          </span>
        </div>
      </Link>
    );
  }
}

const Nav = styled.div<{ $collapsed: boolean }>`
  transition: all 0.2s ease-out;
  min-width: ${(props) => (props.$collapsed ? '72px' : '288px')};
  width: ${(props) => (props.$collapsed ? '72px' : '288px')};
`;
