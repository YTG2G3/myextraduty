import AdminHeader from "@/components/Admin/AdminHeader";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import AdminSchools from "@/components/Admin/AdminSchools";
import AdminUsers from "@/components/Admin/AdminUsers";
import LoadingPage from "@/components/LoadingPage";
import { Enrollment, School, User } from "@/lib/schema";
import SiteContext from "@/lib/site-context";
import { AppShell } from "@mantine/core";
import { IconChalkboard, IconUsersGroup } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function Admin() {
    let { user, school, enrollments } = useContext(SiteContext);
    let { status } = useSession();
    let router = useRouter();
    let [pageIndex, setPageIndex] = useState(0);
    let [schools, setSchools] = useState<School[]>(undefined);
    let [users, setUsers] = useState<User[]>(undefined);

    const loadData = async () => {
        // Schools
        try {
            let sc: School[] = await (await fetch("/api/school/list", { method: "GET" })).json();
            sc.sort((a, b) => a.name.localeCompare(b.name));
            setSchools(sc);
        } catch (error) {
            setSchools([]);
        }

        // Users
        try {
            let us: User[] = await (await fetch("/api/user/list", { method: "GET" })).json();
            us.sort((a, b) => a.admin === b.admin ? a.name.localeCompare(b.name) : a.admin ? -1 : 1);
            setUsers(us);
        } catch (error) {
            setUsers([]);
        }
    }

    useEffect(() => {
        if (school) router.reload();
        else loadData();
    }, []);

    // Loading?
    if (!user || !schools || !users || !enrollments) return <LoadingPage />;

    let pgs = [
        { label: "Schools", icon: <IconChalkboard />, page: <AdminSchools users={users} schools={schools} /> },
        { label: "Users", icon: <IconUsersGroup />, page: <AdminUsers users={users} schools={schools} /> }
    ];

    // Protected route
    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    // Is admin?
    if (!user.admin) {
        router.replace("/console");
        return <></>;
    }

    return (
        <AppShell
            padding="md"
            navbar={<AdminNavbar pageIndex={pageIndex} setPageIndex={setPageIndex} user={user} pgs={pgs} />}
            header={<AdminHeader />}
        >
            {pgs[pageIndex].page}
        </AppShell>
    );
}