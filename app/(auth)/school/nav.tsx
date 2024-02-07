'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Enrollment, School } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import { Session } from "next-auth";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

// TODO - prettier margin for navigator and fix avatar weird margin
export default function Nav({ session, schools, enrollments }: { session: Session, schools: School[], enrollments: Enrollment[] }) {
    let pathname = usePathname();
    let params = useParams<{ id: string }>();
    let [hash, setHash] = useState<string>(undefined);

    useEffect(() => setHash(pathname.indexOf("#") >= 0 ? pathname.substring(pathname.indexOf("#") + 1) : ""), [pathname]);

    if (hash === undefined) return <></>;

    return (
        <nav className="w-72 grid bg-foreground h-screen p-6" style={{ gridTemplateRows: "auto auto 1fr auto" }}>
            <Select defaultValue={params.id ?? "new"} onValueChange={v => redirect("/school/" + v)}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="new">Create a new school</SelectItem>

                    <SelectGroup>
                        <SelectLabel>Owned</SelectLabel>

                        {enrollments.filter(e => e.manager).map((_, i) => <SelectItem key={i} value={schools[i].id}>{schools[i].name}</SelectItem>)}
                    </SelectGroup>

                    <SelectGroup>
                        <SelectLabel>Schools</SelectLabel>

                        {enrollments.filter(e => !e.manager).map((_, i) => <SelectItem key={i} value={schools[i].id}>{schools[i].name}</SelectItem>)}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Separator className="bg-white my-6 h-0.5 rounded" />

            {params.id ? (
                <div className="flex flex-col">
                    <NavItem hash={hash} href="#dashboard">Dashboard</NavItem>
                    <NavItem hash={hash} href="#task">Tasks</NavItem>
                    <NavItem hash={hash} href="#notification">Notifications</NavItem>

                    {enrollments.find(e => e.schoolId === params.id)?.manager ?? (
                        <>
                            <Separator className="bg-white mt-2 h-0.5 rounded" />
                            <p className="text-center text-muted-foreground text-sm mt-2 mb-4">Manager Only</p>

                            <NavItem hash={hash} href="#member">Members</NavItem>
                            <NavItem hash={hash} href="#report">Reports</NavItem>
                            <NavItem hash={hash} href="#setting">Settings</NavItem>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex flex-col justify-center">
                    <StepItem hash={hash} index={0}>Basic Information</StepItem>
                    <StepItem hash={hash} index={1}>Plan Selection</StepItem>
                    <StepItem hash={hash} index={2}>Advanced Information</StepItem>
                    <StepItem hash={hash} index={3}>Complete</StepItem>
                </div>
            )}

            <div className="flex justify-center items-center overflow-hidden">
                <Avatar>
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>{session.user.name}</AvatarFallback>
                </Avatar>

                <div className="text-white ml-4 overflow-hidden">
                    <p className="truncate">{session.user.name}</p>
                    <p className="truncate text-muted-foreground text-sm">{session.user.email}</p>
                </div>
            </div>
        </nav>
    );
}

function NavItem({ hash, href, children }: { hash: string, href: string, children: React.ReactNode }) {
    let hl = hash === href;

    return (
        <Button asChild variant="ghost" className={`text-white mb-3 ${hl ? "bg-white text-foreground font-extrabold" : ""}`}>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    );
}

function StepItem({ hash, index, children }: { hash: string, index: number, children: React.ReactNode }) {
    let hl = Number(hash.substring(1)) >= index;

    return (
        <div className="flex items-center">
            <p className={`select-none text-lg flex justify-center items-center border-2 w-8 h-8 rounded-full ${hl ? "text-white border-solid border-whtie" : "text-muted-foreground border-dotted border-muted-foreground"}`}>{index}</p>

            <Button asChild variant="link" className={`text-white ${!hl ? "pointer-events-none text-muted-foreground" : ""} ${Number(hash.substring(1)) === index ? "font-extrabold" : ""}`}>
                <Link href={"#" + index}>
                    {children}
                </Link>
            </Button>
        </div>
    );
}