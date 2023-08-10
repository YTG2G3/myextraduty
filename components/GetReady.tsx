import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import styles from '@/styles/GetReady.module.scss';
import { Text } from "@mantine/core";

export default function GetReady() {
    let { school } = useContext(SiteContext);
    let [day, setDay] = useState(0);
    let [time, setTime] = useState("");

    useEffect(() => {
        if (school.opening_at) setInterval(() => {
            let d = dayjs(school.opening_at).diff(dayjs());

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