'use client';

import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';

// Imported the menu and viewport separately due to a bug with centering (left-0)

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { getSchoolData } from '@/lib/get-school-data';
import useClientSession from '@/lib/use-client-session';
import { Bell, ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export interface SchoolNavData {
  id: string;
  name: string;
  image: string;
  manager: boolean;
}

export default function SchoolNav() {
  const session = useClientSession();
  const pathname = usePathname();
  const [schoolData, setSchoolData] = useState<SchoolNavData>();

  useEffect(() => {
    if (pathname === '/school') return;
    const id = pathname.split('/')[2];
    getSchoolData(id).then((data) => setSchoolData(data));
  }, [pathname]);

  if (pathname === '/school') return null;

  return (
    <nav
      className="grid w-screen bg-white bg-opacity-80 pl-5 pr-7 py-4"
      style={{ gridTemplateColumns: ' 1fr 1fr 1fr' }}
    >
      <Link
        href="/school"
        className={navigationMenuTriggerStyle() + 'py-4 pr-3 pl-[8px]'}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        <p className="select-none font-grotesque text-3xl font-extrabold">
          {schoolData?.name}
        </p>
      </Link>

      <NavigationMenu className="max-w-screen relative z-10 flex flex-1 items-center justify-center">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/school/${schoolData?.id}/dashboard`}
              className={navigationMenuTriggerStyle()}
            >
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/school/${schoolData?.id}/dashboard`}
              className={navigationMenuTriggerStyle()}
            >
              Tasks
            </NavigationMenuLink>
          </NavigationMenuItem>
          {schoolData?.manager && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="!bg-transparent">
                Managers
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4 md:grid-3">
                  <ListItem
                    href={`/school/${schoolData?.id}/member`}
                    title="Member"
                  >
                    Easily manage {schoolData?.name}&apos;s members.
                  </ListItem>

                  <ListItem
                    href={`/school/${schoolData?.id}/report`}
                    title="Report"
                  >
                    View and download reports for {schoolData?.name}.
                  </ListItem>

                  <ListItem
                    href={`/school/${schoolData?.id}/setting`}
                    title="Setting"
                  >
                    Manage {schoolData?.name}&apos;s settings.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center justify-end gap-1">
        <Bell
          className="w-8 h-8 p-2 rounded-full
                    hover:bg-accent hover:text-accent-foreground
                    focus:bg-accent focus:text-accent-foreground
                    focus:outline-none"
        />
        <div className="px-2">
          <Avatar>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>
              <div className="bg-gray-300"></div>
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="text-sm">{session.user.name}</span>
      </div>
    </nav>
  );
}

function ListItem({
  title,
  children,
  href
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
