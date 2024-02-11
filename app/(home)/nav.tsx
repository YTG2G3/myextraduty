'use client';

import * as React from 'react';
import Link from 'next/link';

// Imported the menu and viewport separately due to a bug with centering (left-0)
import {
  NavigationMenu,
  NavigationMenuViewport
} from '@radix-ui/react-navigation-menu';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import oauthSignIn from '@/lib/oauth-sign-in';

export default function Nav({ authed }: { authed: boolean }) {
  return (
    <nav
      className="z-20 fixed top-0 grid w-screen px-7 py-4 bg-white bg-opacity-80"
      style={{ gridTemplateColumns: ' 1fr 1fr 1fr' }}
    >
      <Link href="/">
        <p
          style={{ letterSpacing: '-0.05em' }}
          className="select-none font-grotesque font-extrabold text-4xl"
        >
          MyExtraDuty
        </p>
      </Link>

      <NavigationMenu className="relative z-10 flex max-w-screen flex-1 items-center justify-center">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="!bg-transparent">
              About Us
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="select-none mb-2 mt-4 text-lg font-grotesque font-extrabold">
                        MyED
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Simplify extra duty organization. Streamline your
                        processes and speed up task allocation with
                        user-friendly platform.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>

                <ListItem href="/partner" title="Partners">
                  Companies, organizations, and schools that we work with.
                </ListItem>

                <ListItem href="/policy" title="Policies">
                  Read our terms of service and privacy policy.
                </ListItem>

                <ListItem href="/contact" title="Contact">
                  Get in touch with us for any questions or feedback.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="!bg-transparent">
              Pricing
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 md:grid-cols-1">
                <ListItem href="/pricing" title="Pricing Plans">
                  Choose a plan that fits your organization&apos;s needs.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="!bg-transparent">
              Developers
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem
                  href="https://github.com/YTG2G3/myextraduty"
                  title="GitHub"
                >
                  Source code and issue tracking. Only Algorix employees have
                  access.
                </ListItem>

                <ListItem
                  href="https://www.erdcloud.com/d/RKYWgfFhHoGsDDfn8"
                  title="Schema"
                >
                  Database schema on ERDCloud. Only Algorix employees have
                  access.
                </ListItem>

                <ListItem
                  href="https://discord.com/invite/Qrspk6GqwJ"
                  title="Discord Server"
                >
                  Official Discord server of G2G3 for MyED developers.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>

        <div className="absolute top-full flex justify-center">
          <NavigationMenuViewport className="origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]" />
        </div>
      </NavigationMenu>

      {authed ? (
        <div className="flex justify-end">
          <Link href="/school" className={navigationMenuTriggerStyle()}>
            Console
          </Link>

          <Button onClick={() => signOut()} className="ml-3">
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => oauthSignIn()}>Sign In</Button>
        </div>
      )}
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
