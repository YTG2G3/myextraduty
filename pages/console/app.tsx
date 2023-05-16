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
import { Member, Task } from "@/lib/schema";

export default function App() {
    let { user, school, enrollments } = useContext(SiteContext);
    let { status } = useSession();
    let [pageIndex, setPageIndex] = useState(0);
    let [manager, setManager] = useState(false);
    let [tasks, setTasks] = useState<Task[]>(undefined);
    let [members, setMembers] = useState<Member[]>(undefined);
    let router = useRouter();

    const loadTasks = async (id: number) => {
        let t: Task[] = await (await fetch("/api/school/task", { method: "GET", headers: { school: String(id) } })).json();
        setTasks(t);
    }

    const loadMembers = async (id: number) => {
        let m: Member[] = await (await fetch("/api/school/member", { method: "GET", headers: { school: String(id) } })).json();
        setMembers(m);
    }

    useEffect(() => {
        if (enrollments && school) {
            let isManager = enrollments.find(v => v.school === school.id).manager;
            setManager(isManager);

            // Load tasks
            loadTasks(school.id);

            // Load members
            if (isManager) loadMembers(school.id);
            else setMembers([]); // no auth
        }
    }, [enrollments, school]);

    // School selected?
    useEffect(() => {
        if (!localStorage.getItem("school")) {
            router.replace("/console/school");
        }
    }, []);

    let pgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <AppDashboard tasks={tasks} /> },
        { label: "Tasks", icon: <IconCalendarEvent />, page: <AppTasks tasks={tasks} /> },
    ];

    let mgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <ManagerDashboard members={members} tasks={tasks} /> },
        { label: "Tasks", icon: <IconCalendarEvent />, page: <ManagerTasks members={members} tasks={tasks} /> },
        { label: "Users", icon: <IconUsersGroup />, page: <ManagerUsers members={members} /> },
        { label: "Settings", icon: <IconSettings />, page: <ManagerSettings /> },
    ]

    // Protected route
    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    // Loading?
    if (!user || !school || !enrollments || !tasks || !members) return <LoadingPage />;

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