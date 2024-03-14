'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
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
  SchoolIcon,
  Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [collapsed, setCollapsed] = navState((state) => [
    state.collapsed,
    state.setCollapsed
  ]);

  return (
    <Nav
      $collapsed={collapsed}
      className="grid h-screen gap-2 bg-secondary p-6 pr-2 select-none"
      style={{ gridTemplateRows: 'auto auto 1fr auto' }}
    >
      <div className="my-1 px-2">
        <div className="flex gap-4 items-center">
          <Image
            src={data.school.image}
            alt={`${data.school.name} logo`}
            width={30}
            height={30}
            className="rounded-md shadow-md"
            priority={true}
          />
          {collapsed ? (
            ''
          ) : (
            <span className="text-sm text-muted-foreground truncate">
              {data.school.name}
            </span>
          )}
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
            <Separator
              className={`h-[1.5px] bg-black opacity-15 ${collapsed ? 'w-[48px]' : ''}`}
            />
            {collapsed ? '' : <p className="text-sm ml-3">Manager Only</p>}
            <div className="flex flex-col gap-1">
              <NavItem to="member" name="Members" icon={<Users />} />
              <NavItem to="report" name="Reports" icon={<ClipboardPenLine />} />
              <NavItem to="setting" name="Settings" icon={<Cog />} />
            </div>
          </>
        ) : undefined}
      </div>

      {collapsed ? (
        <TooltipProvider>
          <div className="flex flex-col gap-1 font-medium">
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div className="flex hover:bg-gray-200 items-center p-3 rounded-full">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>{session.user.name}</AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-normal">{session.user.name}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  onClick={() => router.push('/school')}
                  className="flex hover:bg-gray-200 items-center p-3 rounded-full"
                >
                  <SchoolIcon />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-normal">Select another school</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  onClick={() => setCollapsed(false)}
                  className="flex hover:bg-gray-200 items-center p-3 rounded-full"
                >
                  <ChevronRight />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-normal">Expand</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ) : (
        <div className="flex flex-col gap-1 font-medium">
          <div className="flex items-center overflow-hidden p-3 hover:bg-gray-200 rounded-md">
            <Avatar className="w-6 h-6">
              <AvatarImage src={session.user.image} />
              <AvatarFallback>{session.user.name}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="truncate ml-3">{session.user.name}</p>
            </div>
          </div>
          <div className="flex flex-row items-center hover:bg-gray-200 gap-3 truncate p-3 rounded-md">
            <SchoolIcon /> Select another school
          </div>
          <div
            className="flex flex-row gap-3 p-3 hover:bg-gray-200 cursor-default rounded-md"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft /> <span>Collapse</span>
          </div>
        </div>
      )}
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
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Link href={`${pathway}/${to}`} className="flex items-center">
              <div
                className={`flex items-center hover:bg-gray-200 text-muted-foreground rounded-full p-3 ${active ? 'bg-gray-200' : ''}`}
              >
                <span className={active ? 'text-black' : ''}>{icon}</span>
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
  transition: all 0.15s ease-in-out;
  min-width: ${(props) => (props.$collapsed ? '72px' : '288px')};
  width: ${(props) => (props.$collapsed ? '72px' : '288px')};
`;
