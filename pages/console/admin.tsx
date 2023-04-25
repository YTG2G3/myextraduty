import AdminHeader from "@/components/Admin/AdminHeader";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import AdminSchools from "@/components/Admin/AdminSchools";
import AdminUsers from "@/components/Admin/AdminUsers";
import LoadingPage from "@/components/LoadingPage";
import { listSchools, listUsers } from "@/lib/db";
import SiteContext from "@/lib/site-context";
import { AppShell } from "@mantine/core";
import { IconChalkboard, IconUsersGroup } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function Admin(props: any) {
    let { user } = useContext(SiteContext);
    let { status } = useSession();
    let router = useRouter();
    let [pageIndex, setPageIndex] = useState(0);

    let pgs = [
        { label: "Schools", icon: <IconChalkboard />, page: <AdminSchools {...props} /> },
        { label: "Users", icon: <IconUsersGroup />, page: <AdminUsers {...props} /> }
    ];

    // Protected route
    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    // Loading?
    if (!user) return <LoadingPage />;

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

export async function getStaticProps() {
    let schools = await listSchools();
    schools.sort((a, b) => a.name.localeCompare(b.name));

    let users = await listUsers();
    // TODO - test if this sorts correctly
    users.sort((a, b) => a.admin ? -1 : b.admin ? 1 : a.name.localeCompare(b.name));

    return { props: { schools, users }, revalidate: 10 };
}