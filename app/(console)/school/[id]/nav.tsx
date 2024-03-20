'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  LogOut,
  Moon,
  SchoolIcon,
  Sun,
  Users
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { create } from 'zustand';

interface INavState {
  preCollapsed: boolean;
  setPreCollapsed: (preCollapsed: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navState = create<INavState>((set) => ({
  preCollapsed: false,
  setPreCollapsed: (preCollapsed) => set({ preCollapsed }),
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
  const [preCollapsed, setPreCollapsed] = navState((state) => [
    state.preCollapsed,
    state.setPreCollapsed
  ]);

  useEffect(() => {
    if (preCollapsed === true) {
      setTimeout(() => {
        setCollapsed(preCollapsed);
      }, 150);
    } else {
      setCollapsed(preCollapsed);
    }
  }, [preCollapsed, setCollapsed]);
  const { theme, setTheme } = useTheme();

  return (
    <Nav
      $collapsed={preCollapsed}
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
              className={`h-[1.5px] bg-primary opacity-15 transition-all ${preCollapsed ? 'w-[48px]' : ''}`}
            />
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
                <div
                  onClick={() => router.push('/school')}
                  className="flex hover:bg-background items-center p-3 rounded-full"
                >
                  <SchoolIcon />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-normal">Select another school</p>
              </TooltipContent>
            </Tooltip>
            <UserDropdown>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <div className="flex hover:bg-background items-center p-3 rounded-full">
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
            </UserDropdown>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  onClick={() => setPreCollapsed(false)}
                  className="flex hover:bg-background items-center p-3 rounded-full"
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
          <div
            onClick={() => router.push('/school')}
            className="flex flex-row items-center cursor-pointer hover:bg-background gap-3 truncate p-3 rounded-full"
          >
            <SchoolIcon /> Select another school
          </div>
          <UserDropdown>
            <div className="flex items-center overflow-hidden p-3 hover:bg-background cursor-pointer rounded-full">
              <Avatar className="w-6 h-6">
                <AvatarImage src={session.user.image} />
                <AvatarFallback>{session.user.name}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="truncate ml-3">{session.user.name}</p>
              </div>
            </div>
          </UserDropdown>
          <div
            className="flex flex-row gap-3 p-3 hover:bg-background cursor-pointer rounded-full"
            onClick={() => setPreCollapsed(true)}
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

  const school_id = pathname.split('/')[2];

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
            <Link
              href={`/school/${school_id}/${to}`}
              className="flex items-center"
            >
              <div
                className={`flex items-center hover:bg-background text-muted-foreground rounded-full p-3 ${active ? 'bg-background' : ''}`}
              >
                <span className={active ? 'text-primary' : ''}>{icon}</span>
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
      <Link
        href={`/school/${school_id}/${to}`}
        className="flex items-center w-full"
      >
        <div
          className={`flex items-center hover:bg-background text-muted-foreground rounded-full p-3 w-full ${active ? 'bg-background' : ''}`}
        >
          <span className={active ? 'text-primary' : ''}>{icon}</span>
          <span className="ml-3 overflow-hidden font-medium">
            <p className={active ? 'text-primary' : ''}>{name}</p>
          </span>
        </div>
      </Link>
    );
  }
}

function UserDropdown({ children }: { children: React.ReactNode }) {
  const session = useClientSession();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="font-normal p-2">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-sm text-muted-foreground">
          {session.user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {theme === 'light' ? (
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className="flex flex-row gap-2"
          >
            <Moon />
            <span>Switch to dark mode</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className="flex flex-row gap-2"
          >
            <Sun />
            <span>Switch to light mode</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="flex flex-row gap-2">
          <LogOut />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Nav = styled.div<{ $collapsed: boolean }>`
  transition-duration: 150ms;
  transition-property: width, min-width;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  min-width: ${(props) => (props.$collapsed ? '72px' : '288px')};
  width: ${(props) => (props.$collapsed ? '72px' : '288px')};
`;
