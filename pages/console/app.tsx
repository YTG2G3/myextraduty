import AppDashboard from "@/components/App/AppDashboard";
import AppEvents from "@/components/App/AppEvents";
import AppHeader from "@/components/App/AppHeader";
import AppNavbar from "@/components/App/AppNavbar";
import LoadingPage from "@/components/LoadingPage";
import ManagerDashboard from "@/components/Manager/ManagerDashboard";
import ManagerEvents from "@/components/Manager/ManagerEvents";
import ManagerSettings from "@/components/Manager/ManagerSettings";
import ManagerUsers from "@/components/Manager/ManagerUsers";
import SiteContext from "@/lib/site-context";
import { AppShell } from "@mantine/core";
import { IconCalendarEvent, IconLayoutDashboard, IconSettings, IconUsersGroup } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function App(props: any) {
    let { user, school, enrollments } = useContext(SiteContext);
    let { status } = useSession();
    let [pageIndex, setPageIndex] = useState(0);
    let [manager, setManager] = useState(false);
    let router = useRouter();

    // Manager?
    useEffect(() => enrollments ? setManager(enrollments.find(v => v.school === school.id).manager) : undefined, [enrollments]);

    let pgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <AppDashboard {...props} /> },
        { label: "Events", icon: <IconCalendarEvent />, page: <AppEvents {...props} /> },
    ];

    let mgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <ManagerDashboard {...props} /> },
        { label: "Events", icon: <IconCalendarEvent />, page: <ManagerEvents {...props} /> },
        { label: "Users", icon: <IconUsersGroup />, page: <ManagerUsers {...props} /> },
        { label: "Settings", icon: <IconSettings />, page: <ManagerSettings {...props} /> },
    ]

    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    if (!user || !school || !enrollments) return <LoadingPage />;

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