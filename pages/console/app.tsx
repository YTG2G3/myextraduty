import AppDashboard from "@/components/App/AppDashboard";
import AppHeader from "@/components/App/AppHeader";
import AppNavbar from "@/components/App/AppNavbar";
import LoadingPage from "@/components/LoadingPage";
import SiteContext from "@/lib/site-context";
import { AppShell } from "@mantine/core";
import { IconLayoutDashboard } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useContext, useState } from "react";

export default function App(props: any) {
    let { user } = useContext(SiteContext);
    let { status } = useSession();
    let [pageIndex, setPageIndex] = useState(0);

    let pgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <AppDashboard {...props} /> },
    ];

    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    if (!user) return <LoadingPage />;

    return (
        <AppShell
            padding="md"
            navbar={<AppNavbar pageIndex={pageIndex} setPageIndex={setPageIndex} user={user} pgs={pgs} />}
            header={<AppHeader />}
        >
            {pgs[pageIndex].page}
        </AppShell>
    );
}

// TODO - load events and stuff
export async function getStaticProps() {

    return { props: {}, revalidate: 10 };
}