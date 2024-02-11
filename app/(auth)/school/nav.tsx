'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import boardingSteps from "@/lib/boarding-steps";
import { navigate } from "@/lib/navigate";
import useClientSession from "@/lib/use-client-session";
import { Enrollment, School } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";

// TODO - prettier margin for navigator and fix avatar weird margin, add a logout button
export default function Nav({ schools, enrollments }: { schools: School[], enrollments: Enrollment[] }) {
    let session = useClientSession();
    let params = useParams<{ id: string }>();
    let [selectValue, setSelectValue] = useState("new");

    useEffect(() => params?.id ? setSelectValue(params.id) : undefined, [params]);

    function update(v: string) {
        setSelectValue(v);
        navigate(v === "new" ? "/school/new" : `/school/${v}/dashboard`);
    }

    return (
        <nav className="w-72 grid bg-foreground h-screen p-6" style={{ gridTemplateRows: "auto auto 1fr auto" }}>
            <Select value={selectValue} onValueChange={update}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="new">Create a new school</SelectItem>

                    {schools.find(s => s.ownerId === session.user.id) && (
                        <SelectGroup>
                            <SelectLabel>Owner</SelectLabel>

                            {schools.filter(s => s.ownerId === session.user.id).map((s, i) => <SelectItem key={i} value={s.id}>{s.name}</SelectItem>)}
                        </SelectGroup>
                    )}

                    {enrollments.find((e, i) => e.manager && schools[i].ownerId !== session.user.id) && (
                        <SelectGroup>
                            <SelectLabel>Manager</SelectLabel>

                            {enrollments.filter((e, i) => e.manager && schools[i].ownerId !== session.user.id).map((_, i) => <SelectItem key={i} value={schools[i].id}>{schools[i].name}</SelectItem>)}
                        </SelectGroup>
                    )}

                    {enrollments.find(e => !e.manager) && (
                        <SelectGroup>
                            <SelectLabel>Member</SelectLabel>

                            {enrollments.filter(e => !e.manager).map((_, i) => <SelectItem key={i} value={schools[i].id}>{schools[i].name}</SelectItem>)}
                        </SelectGroup>
                    )}
                </SelectContent>
            </Select>

            <Separator className="bg-white my-6 h-0.5 rounded" />

            {params.id ? (
                <div className="flex flex-col">
                    <NavItem to="dashboard">Dashboard</NavItem>
                    <NavItem to="task">Tasks</NavItem>
                    <NavItem to="alert">Alerts</NavItem>

                    {enrollments.find(e => e.schoolId === params.id).manager ? (
                        <>
                            <Separator className="bg-white mt-2 h-0.5 rounded" />
                            <p className="text-center text-muted-foreground text-sm mt-2 mb-4">Manager Only</p>

                            <NavItem to="member">Members</NavItem>
                            <NavItem to="report">Reports</NavItem>
                            <NavItem to="setting">Settings</NavItem>
                        </>
                    ) : undefined}
                </div>
            ) : (
                <div className="flex flex-col justify-center">
                    {boardingSteps.map((s, i) => <StepItem key={i} to={s.to}>{s.name}</StepItem>)}
                </div>
            )}

            <div className="flex justify-center items-center overflow-hidden">
                <Avatar>
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>{session.user.name}</AvatarFallback>
                </Avatar>

                <div className="text-white ml-3 overflow-hidden">
                    <p className="truncate">{session.user.name}</p>
                    <p className="truncate text-muted-foreground text-sm">{session.user.email}</p>
                </div>
            </div>
        </nav>
    );
}

function NavItem({ to, children }: { to: string, children: React.ReactNode }) {
    let pathname = usePathname();
    if (!pathname) return <></>

    let path = pathname.substring(pathname.lastIndexOf("/") + 1);
    let pathway = pathname.substring(0, pathname.lastIndexOf("/"));

    return (
        <Button asChild variant="ghost" className={`text-white mb-3 ${path === to ? "bg-white text-foreground font-extrabold" : ""}`}>
            <Link href={`${pathway}/${to}`}>
                {children}
            </Link>
        </Button>
    );
}

function StepItem({ to, children }: { to: string, children: React.ReactNode }) {
    let pathname = usePathname();
    if (!pathname) return <></>

    // TODO - enable the one that is already complete using sessionStorage (ex. if saved 2, come back to 1, then 2 should still be clickable)

    let path = pathname.substring(pathname.lastIndexOf("/") + 1);
    let index_path = boardingSteps.findIndex(s => s.to === path);
    let index_to = boardingSteps.findIndex(s => s.to === to);

    return (
        <div className="flex items-center">
            <p className={`select-none text-lg flex justify-center items-center border-2 w-8 h-8 rounded-full ${index_path >= index_to ? "text-white border-solid border-white" : "text-muted-foreground border-dotted border-muted-foreground"}`}>{index_to}</p>

            <Button asChild variant="link" className={`text-white ${index_path < index_to ? "pointer-events-none text-muted-foreground" : ""} ${index_path === index_to ? "font-extrabold" : ""}`}>
                <Link href={`/school/new/${to}`}>
                    {children}
                </Link>
            </Button>
        </div>
    );
}