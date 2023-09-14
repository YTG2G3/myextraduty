import { receivedResponse } from '@/lib/received-response';
import { School, Profile } from '@/lib/schema';
import styles from '@/styles/AdminUsers.module.scss';
import { Accordion, ActionIcon, Group, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconBooks, IconUser, IconUserCog, IconUserShield, IconUserX } from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from "react";
import EnrollmentsModal from '../EnrollmentsModal';

const viewPerPage = 50;

export default function AdminUsers({ users, schools }: { users: Profile[], schools: School[] }) {
    let [search, setSearch] = useState("");

    const searchForUser = (v: Profile) => (
        v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        v.email.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );

    let us: Profile[] = users.filter(searchForUser).splice(0, viewPerPage);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str);
    }

    const promoteUser = async (u: Profile) => modals.openConfirmModal({
        title: `Are you sure about promoting ${u.name}?`,
        children: <Text size="sm">This action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        onConfirm: async () => {
            let x = (await fetch("/api/user/promote", { method: "POST", body: u.email })).status;

            receivedResponse(x);
        }
    });

    const removeUser = async (u: Profile) => modals.openConfirmModal({
        title: `Are you sure about removing ${u.name}?`,
        children: <Text size="sm">Any schools that the user owns will also be removed and this action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
            let x = (await fetch("/api/user/remove", { method: "POST", body: u.email })).status;

            receivedResponse(x);
        }
    });

    const enrollmentsUser = async (u: Profile) => modals.open({
        title: `Enrollments for ${u.name}`,
        children: <EnrollmentsModal user={u} sc={schools} />,
        centered: true
    })

    return (
        <div className={styles.container}>
            <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />
            <Text size="sm" color="dimmed">Displaying max {viewPerPage} users</Text>

            <Accordion style={{ width: "100%", marginTop: 20 }}>
                {us.map((v, i) => (
                    <Accordion.Item key={i} value={v.email}>
                        <Accordion.Control icon={
                            v.admin ? (
                                <Tooltip label="Manager">
                                    <IconUserCog color="blue" />
                                </Tooltip>
                            ) : (
                                <IconUser />
                            )
                        }>
                            <Text weight="bold" color={v.admin ? "#339AF0" : undefined}>{v.name} {v.admin ? "(Admin)" : undefined}</Text>
                        </Accordion.Control>

                        <Accordion.Panel>
                            <Group>
                                <Image src={v.picture} width={100} height={100} alt={v.name} />

                                <Stack ml="lg">
                                    <Text>Email: {v.email}</Text>

                                    {!v.admin ? (
                                        <Group style={{ width: "100%", justifyContent: "center" }}>
                                            <Tooltip label="Enrollments">
                                                <ActionIcon onClick={() => enrollmentsUser(v)}><IconBooks /></ActionIcon>
                                            </Tooltip>

                                            <Tooltip label="Promote">
                                                <ActionIcon onClick={() => promoteUser(v)}><IconUserShield color="blue" /></ActionIcon>
                                            </Tooltip>

                                            <Tooltip label="Remove">
                                                <ActionIcon onClick={() => removeUser(v)}><IconUserX color='red' /></ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    ) : undefined}
                                </Stack>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}