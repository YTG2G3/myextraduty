import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext } from "react";
import GetReady from "../GetReady";
import { Text } from "@mantine/core";

// TODO - upcoming events, quota, status of members
export default function ManagerDashboard(props: any) {
    let { school } = useContext(SiteContext);

    if (!school.opening_at) return <Text>To start the countdown, please set the opening date in settings.</Text>

    if (dayjs(school.opening_at).isAfter(dayjs())) return <GetReady />

    return (
        <div>

        </div>
    );
}