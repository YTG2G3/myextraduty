import { ActionIcon, Button, Group, MANTINE_COLORS, Pagination, Select, TextInput, Image, Card, Text, Space, Tooltip, NumberInput, Autocomplete } from "@mantine/core";
import styles from '@/styles/AdminSchools.module.scss';
import { useContext, useState } from "react";
import { School, Profile } from "@/lib/schema";
import { IconArrowsTransferUp, IconCirclePlus, IconDoorExit, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { modals } from '@mantine/modals';
import { DateTimePicker } from "@mantine/dates";
import { receivedResponse } from "@/lib/received-response";
import SiteContext from "@/lib/site-context";

const viewPerPage = 9;

export default function AdminSchools({ schools, users }: { schools: School[], users: Profile[] }) {
    let { user, enrollments } = useContext(SiteContext);
    let [search, setSearch] = useState("");

    const searchForSchool = (v: School) => (
        v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        v.owner.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        v.address.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );

    let sch: School[] = schools.filter(searchForSchool);
    let [page, setPage] = useState(1);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setPage(1);
        setSearch(str);
    }

    const createSchoolReq = async (e: any) => {
        e.preventDefault();

        let b = {
            name: e.target.name.value,
            owner: e.target.owner.value,
            address: e.target.address.value,
            primary_color: e.target.primary_color.value,
            logo: e.target.logo.value
        }

        let s = (await fetch("/api/school/create", { method: "POST", body: JSON.stringify(b) })).status;

        receivedResponse(s);
    }

    const createSchool = () => modals.open({
        title: "Adding a new school",
        centered: true,
        children: (
            <form onSubmit={createSchoolReq} style={{ padding: 30 }}>
                <TextInput name="name" withAsterisk label="Name" />
                <Autocomplete name="owner" withAsterisk label="Owner" data={users.map(v => v.email)} />
                <TextInput name="address" withAsterisk label="Address" />
                <Select name="primary_color" withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} defaultValue="blue" />
                <TextInput name="logo" withAsterisk label="School Logo URL" />

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        )
    });

    const deleteSchool = (s: School) => modals.openConfirmModal({
        title: `Are you sure about deleting ${s.name}?`,
        children: <Text size="sm">This action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
            let x = (await fetch("/api/school/delete", { method: "POST", body: String(s.id) })).status;

            receivedResponse(x);
        },
    });

    const changeOwnerReq = async (e: any, sc: School) => {
        e.preventDefault();

        let b = { email: e.target.owner.value };
        let x = (await fetch("/api/school/transfer", { method: "POST", body: JSON.stringify(b), headers: { school: String(sc.id) } })).status;

        receivedResponse(x);
    }

    const changeOwner = (s: School) => modals.open({
        title: `Changing owner of ${s.name}?`,
        centered: true,
        children: (
            <form onSubmit={(e) => changeOwnerReq(e, s)}>
                <Autocomplete name="owner" withAsterisk label="Owner" defaultValue={s.owner} data={users.map(v => v.email)} />

                <Group position="right" mt="md">
                    <Button type="submit">Save</Button>
                </Group>
            </form>
        )
    });

    const editSchoolReq = async (e: any, sc: School) => {
        e.preventDefault();

        let b = {
            address: e.target.address.value,
            primary_color: e.target.primary_color.value,
            logo: e.target.logo.value,
            opening_at: e.target.opening_at.value === "" ? null : e.target.opening_at.value,
            quota: e.target.quota.value,
            max_assigned: e.target.max_assigned.value
        };

        let s = (await fetch("/api/school/update", { method: "POST", body: JSON.stringify(b), headers: { school: String(sc.id) } })).status;

        receivedResponse(s);
    }

    const editSchool = (s: School) => modals.open({
        title: `Editing ${s.name}`,
        centered: true,
        children: (
            <form onSubmit={(e) => editSchoolReq(e, s)} style={{ padding: 30 }}>
                <TextInput name="address" withAsterisk label="Address" defaultValue={s.address} />
                <Select name="primary_color" withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} defaultValue={s.primary_color} />
                <TextInput name="logo" withAsterisk label="School Logo URL" defaultValue={s.logo} />
                <DateTimePicker valueFormat='MMMM D, YYYY HH:MM A' name="opening_at" label="Opening At" defaultValue={s.opening_at !== "null" ? new Date(s.opening_at) : null} />
                <NumberInput name="quota" label="Quota" min={0} defaultValue={s.quota} />
                <NumberInput name="max_assigned" label="Max Assigned" min={0} defaultValue={s.max_assigned} />

                <Group position="right" mt="md">
                    <Button type="submit">Save</Button>
                </Group>
            </form>
        )
    });

    const enrollSchool = (s: School) => modals.openConfirmModal({
        title: `Are you sure about enrolling in ${s.name}?`,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        onConfirm: async () => {
            let b = { email: user.email };
            let x = (await fetch("/api/school/member", { method: "POST", body: JSON.stringify(b), headers: { school: String(s.id) } })).status;
            x = (await fetch("/api/school/member/promote", { method: "POST", body: JSON.stringify(b), headers: { school: String(s.id) } })).status;

            receivedResponse(x);
        }
    });

    const leaveSchool = (s: School) => modals.openConfirmModal({
        title: `Are you sure about leaving ${s.name}?`,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        confirmProps: { color: 'red' },
        onConfirm: async () => {
            let b = { email: user.email };
            let x = (await fetch("/api/school/member/remove", { method: "POST", body: JSON.stringify(b), headers: { school: String(s.id) } })).status;

            receivedResponse(x);
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.gro} >
                <TextInput placeholder="School name" value={search} onChange={onSearch} />

                <Tooltip label="Add">
                    <ActionIcon m="md" variant="filled" onClick={createSchool}><IconPlus /></ActionIcon>
                </Tooltip>
            </div>

            <div className={styles.li}>
                <Group>
                    <Pagination value={page} onChange={setPage} total={(sch.length - 1) / viewPerPage + 1} />
                    <Text size="sm" color="dimmed">Displaying {viewPerPage} per page</Text>
                </Group>

                <div className={styles.list}>
                    {sch.slice((page - 1) * viewPerPage, (page - 1) * viewPerPage + viewPerPage).map((v, i) => (
                        <Card key={i} m="md" style={{ maxWidth: 500, minWidth: 200, width: "30%" }} shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section>
                                <Image src={v.logo} height={160} alt={v.name} fit="cover" />
                            </Card.Section>

                            <Group position="apart" mt="md" mb="xs">
                                <Text weight={500}>{v.name}</Text>
                            </Group>

                            <Text size="sm" color="dimmed" className={styles.t}>Owned by {v.owner}.</Text>
                            <Text size="sm" color="dimmed" className={styles.t}>{v.address}</Text>

                            <Space h="md" />

                            <Group position="right">
                                {enrollments.find(er => er.school === v.id) ? (
                                    <Tooltip label="Leave">
                                        <ActionIcon onClick={() => leaveSchool(v)}><IconDoorExit color="red" /></ActionIcon>
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="Enroll">
                                        <ActionIcon onClick={() => enrollSchool(v)}><IconCirclePlus /></ActionIcon>
                                    </Tooltip>
                                )}

                                <Tooltip label="Change Owner">
                                    <ActionIcon onClick={() => changeOwner(v)}><IconArrowsTransferUp /></ActionIcon>
                                </Tooltip>

                                <Tooltip label="Edit">
                                    <ActionIcon onClick={() => editSchool(v)}><IconEdit /></ActionIcon>
                                </Tooltip>

                                <Tooltip label="Delete">
                                    <ActionIcon onClick={() => deleteSchool(v)}><IconTrash color="red" /></ActionIcon>
                                </Tooltip>
                            </Group>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}