import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext } from "react";
import GetReady from "../GetReady";

// TODO - upcoming events, quota, status of members
export default function ManagerDashboard(props: any) {
    let { school } = useContext(SiteContext);

    // TODO - fix null maybe?
    if (!school.opening_at) return (
        <div>To start the countdown, please set the opening date in settings.</div>
    );

    if (dayjs(school.opening_at).isAfter(dayjs())) return <GetReady />

    return (
        <div>

        </div>
    );
}