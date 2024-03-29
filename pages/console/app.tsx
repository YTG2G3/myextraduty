import AppDashboard from "@/components/App/AppDashboard";
import AppHeader from "@/components/App/AppHeader";
import AppNavbar from "@/components/App/AppNavbar";
import LoadingPage from "@/components/LoadingPage";
import ManagerDashboard from "@/components/Manager/ManagerDashboard";
import ManagerSettings from "@/components/Manager/ManagerSettings";
import ManagerUsers from "@/components/Manager/ManagerUsers";
import SiteContext from "@/lib/site-context";
import { AppShell } from "@mantine/core";
import { IconCalendarEvent, IconLayoutDashboard, IconSettings, IconUsersGroup } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AppTasks from "@/components/App/AppTasks";
import ManagerTasks from "@/components/Manager/ManagerTasks";
import { Assignment, Member, Task } from "@/lib/schema";
import dayjs from "dayjs";

export default function App() {
    let { user, school, enrollments } = useContext(SiteContext);
    let { status } = useSession();
    let [pageIndex, setPageIndex] = useState(0);
    let [manager, setManager] = useState(false);
    let [tasks, setTasks] = useState<Task[]>(undefined);
    let [members, setMembers] = useState<Member[]>(undefined);
    let [categories, setCategories] = useState<string[]>(undefined);
    let [assignments, setAssignments] = useState<Assignment[]>(undefined);
    let router = useRouter();

    const loadData = async (id: number) => {
        // Tasks
        try {
            let t: Task[] = await (await fetch("/api/school/task", { method: "GET", headers: { school: String(id) } })).json();
            t.sort((a, b) => {
                let sd = dayjs(a.starting_date + " " + a.starting_time);
                let ssd = dayjs(b.starting_date + " " + b.starting_time);
                let ed = dayjs(a.ending_date + " " + a.ending_time);
                let eed = dayjs(b.ending_date + " " + b.ending_time);

                if (sd.isSame(ssd)) {
                    if (ed.isSame(eed)) return a.category.localeCompare(b.category);
                    return ed.isBefore(eed) ? -1 : 1;
                }
                return sd.isBefore(ssd) ? -1 : 1;
            });
            setTasks(t);
        } catch (error) {
            setTasks([]);
        }

        // Members
        try {
            let m: Member[] = await (await fetch("/api/school/member", { method: "GET", headers: { school: String(id) } })).json();
            m.sort((a, b) => {
                // Owner first, then manager, then registered, then alphabetical
                if (school.owner === a.email) return -1;
                if (school.owner === b.email) return 1;

                if (a.manager) return -1;
                if (b.manager) return 1;

                if (a.name !== "" && b.name === "") return -1;
                if (a.name === "" && b.name !== "") return 1;
                if (a.name === "" && b.name === "") return a.email.localeCompare(b.email);

                return a.name.localeCompare(b.name);
            });
            setMembers(m);
        } catch (error) {
            setMembers([]);
        }

        // Categories
        try {
            let c: string[] = await (await fetch("/api/school/categories", { method: "GET", headers: { school: String(id) } })).json();
            setCategories(c);
        } catch (error) {
            setCategories([]);
        }

        // Assignments
        try {
            let a: Assignment[] = await (await fetch("/api/school/assignments", { method: "GET", headers: { school: String(id) } })).json();
            setAssignments(a);
        } catch (error) {
            setAssignments([]);
        }
    }

    useEffect(() => {
        if (enrollments && school) {
            let isManager = enrollments.find(v => v.school === school.id).manager;

            setManager(isManager);
            loadData(school.id);
        }
    }, [enrollments, school]);

    // School selected?
    useEffect(() => {
        if (!localStorage.getItem("school")) router.replace("/console/school");
        else if (localStorage.getItem("refresh")) {
            localStorage.removeItem("refresh");
            router.reload();
        }
    }, []);

    let pgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <AppDashboard tasks={tasks} assignments={assignments} setPageIndex={setPageIndex} /> },
        { label: "Tasks", icon: <IconCalendarEvent />, page: <AppTasks tasks={tasks} categories={categories} assignments={assignments} /> },
    ];

    let mgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <ManagerDashboard members={members} tasks={tasks} assignments={assignments} /> },
        { label: "Tasks", icon: <IconCalendarEvent />, page: <ManagerTasks tasks={tasks} categories={categories} assignments={assignments} members={members} /> },
        { label: "Users", icon: <IconUsersGroup />, page: <ManagerUsers members={members} assignments={assignments} /> },
        { label: "Settings", icon: <IconSettings />, page: <ManagerSettings members={members} /> },
    ]

    // Protected route
    if (status === "unauthenticated") {
        signIn(null, { callbackUrl: "/console/app" });
        return <></>;
    }

    // Loading?
    if (!user || !school || !enrollments || !tasks || !members || !categories || !assignments) return <LoadingPage />;

    // Associated?
    if (!enrollments.find(v => v.school === school.id)) {
        router.replace("/404");
        return <></>;
    }

    return (
        <AppShell
            padding="md"
            navbar={<AppNavbar pageIndex={pageIndex} setPageIndex={setPageIndex} user={user} pgs={manager ? mgs : pgs} />}
            header={<AppHeader />}
        >
            {manager ? mgs[pageIndex].page : pgs[pageIndex].page}
        </AppShell>
    );
}