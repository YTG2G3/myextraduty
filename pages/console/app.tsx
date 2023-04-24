import AppDashboard from "@/components/App/AppDashboard";
import AppEvents from "@/components/App/AppEvents";
import AppHeader from "@/components/App/AppHeader";
import AppNavbar from "@/components/App/AppNavbar";
import LoadingPage from "@/components/LoadingPage";
import SiteContext from "@/lib/site-context";
import { AppShell } from "@mantine/core";
import { IconCalendarEvent, IconLayoutDashboard } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useContext, useState } from "react";

export default function App(props: any) {
    let { user, school } = useContext(SiteContext);
    let { status } = useSession();
    let [pageIndex, setPageIndex] = useState(0);

    let pgs = [
        { label: "Dashboard", icon: <IconLayoutDashboard />, page: <AppDashboard {...props} /> },
        { label: "Events", icon: <IconCalendarEvent />, page: <AppEvents {...props} /> },
    ];

    // TODO - manager pgs
    let mgs = [

    ]

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