import { User } from '@/lib/schema';
import styles from '@/styles/AdminUsers.module.scss';
import { Accordion, TextInput } from '@mantine/core';
import { useState } from "react";

export default function AdminUsers({ users }: any) {
    let [search, setSearch] = useState("");

    const searchForUser = (v: User) => (
        v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        v.email.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );

    let us: User[] = users.filter(searchForUser);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str);
    }

    // TODO - pagination and effcient searching without loading the whole table
    return (
        <div className={styles.container}>
            <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />

            <Accordion>
                {us.map((v, i) => (
                    <Accordion.Item key={i} value={v.email}>
                        <Accordion.Control>{v.name}</Accordion.Control>
                        <Accordion.Panel>{v.email}</Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}