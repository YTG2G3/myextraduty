import { User } from '@/lib/schema';
import styles from '@/styles/AdminUsers.module.scss';
import { Accordion, ActionIcon, Group, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconUserShield, IconUserX } from '@tabler/icons-react';
import Image from 'next/image';
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

    const promoteUser = async (u: User) => modals.openConfirmModal({
        title: `Are you sure about promoting ${u.name}?`,
        children: <Text size="sm">This action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        onConfirm: async () => {
            let x = (await fetch("/api/user/promote", { method: "POST", body: String(s.id) })).status;

            if (x === 200) notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
            else notifications.show({ title: "Failed to delete school", message: "Please contact Algorix to fix this error.", color: "red" });
        }
    });

    const resetUser = async (u: User) => {

    }

    // TODO - pagination and effcient searching without loading the whole table
    // TODO - manage users' enrollments
    return (
        <div className={styles.container}>
            <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />

            <Accordion style={{ width: "100%", marginTop: 20 }}>
                {us.map((v, i) => (
                    <Accordion.Item key={i} value={v.email}>
                        <Accordion.Control><Text color={v.admin ? "#339AF0" : undefined}>{v.name} {v.admin ? "(Admin)" : undefined}</Text></Accordion.Control>

                        <Accordion.Panel>
                            <Group>
                                <Image src={v.picture} width={100} height={100} alt={v.name} />

                                <Stack ml="lg">
                                    <Text>Email: {v.email}</Text>

                                    <Group style={{ width: "100%", justifyContent: "center" }}>
                                        {!v.admin ? <Tooltip label="Assign Admin Role">
                                            <ActionIcon onClick={() => promoteUser(v)}><IconUserShield color="#339AF0" /></ActionIcon>
                                        </Tooltip> : undefined}

                                        <Tooltip label="Reset">
                                            <ActionIcon onClick={() => resetUser}><IconUserX color='red' /></ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Stack>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}