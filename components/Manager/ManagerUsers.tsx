import { Accordion, TextInput } from "@mantine/core";
import styles from '@/styles/ManagerUsers.module.scss';
import { useState } from "react";

// TODO - manage users
export default function ManagerUsers(props: any) {
    let [search, setSearch] = useState("");

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str);
    }

    return (
        <div className={styles.container}>
            <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />

            <Accordion style={{ width: "100%", marginTop: 20 }}>

            </Accordion>
        </div>
    );
}