import AdminHeader from "@/components/AdminHeader";
import AdminNavbar from "@/components/AdminNavbar";
import SiteContext from "@/lib/site-context";
import { AppShell, Header, Navbar, Text } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Admin() {
    let { user } = useContext(SiteContext);
    let { status } = useSession();
    let router = useRouter();

    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    if (!user) return <></>;

    if (!user.is_admin) {
        router.replace("/console");
        return <></>;
    }

    return (
        <AppShell
            padding="md"
            navbar={<AdminNavbar />}
            header={<AdminHeader />}
        >

        </AppShell>
    );
}