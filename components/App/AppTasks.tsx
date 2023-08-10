import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext } from "react";
import GetReady from "../GetReady";

// TODO - calendar view, list view, signup etc
export default function AppTasks(props: any) {
    let { school } = useContext(SiteContext);

    if (!school.opening_at || dayjs(school.opening_at).isAfter(dayjs())) return <GetReady />;

    return (
        <div>

        </div>
    );
}