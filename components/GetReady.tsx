import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import styles from '@/styles/GetReady.module.scss';
import { Button, Text } from "@mantine/core";

export default function GetReady() {
    let { school } = useContext(SiteContext);
    let [day, setDay] = useState(0);
    let [time, setTime] = useState("");
    let [open, setOpen] = useState(false);

    useEffect(() => {
        if (school.opening_at) setInterval(() => {
            let d = dayjs.tz(school.opening_at, "America/Los_Angeles").diff(dayjs());
            if (d <= 0) setOpen(true);

            let seconds = Math.floor((d / 1000) % 60);
            let minutes = Math.floor((d / (1000 * 60)) % 60);
            let hours = Math.floor((d / (1000 * 60 * 60)) % 24);
            let days = Math.floor(d / (1000 * 60 * 60 * 24));

            setDay(days);
            setTime(`${hours}h ${minutes}m ${seconds}s`);
        }, 100);
    }, []);

    if (!school.opening_at) return (
        <div className={styles.container}>
            <Text size="10vw">--:--:--</Text>
        </div>
    );

    if (open) return (
        <div className={styles.container}>
            <Text size="10vw">Open!</Text>
            <Button onClick={() => window.location.reload()} p="lg" m="lg" size="20px">Reload</Button>
        </div>
    );

    return (
        <div className={styles.container}>
            {day === 0 ? (
                <>
                    <Text size="3vw" color="dimmed">{day} Days</Text>
                    <Text size="10vw">{time}</Text>
                </>
            ) : (
                <>
                    <Text size="10vw">{day} Days</Text>
                    <Text size="3vw" color="dimmed">{time}</Text>
                </>
            )}
        </div>
    );
}