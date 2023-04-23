import { ActionIcon, Button, Group, MANTINE_COLORS, Pagination, Select, TextInput, Image, Card, Text, Space, Tooltip } from "@mantine/core";
import styles from '@/styles/AdminSchools.module.scss';
import { useState } from "react";
import { School } from "@/lib/schema";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

const viewPerPage = 9;

export default function AdminSchools({ schools }: any) {
    let [search, setSearch] = useState("");
    let sch: School[] = schools.filter((v: School) => v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0);
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

        if (s === 200) {
            modals.closeAll();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to add school", message: "Please confirm that the owner's MyExtraDuty account has been created.", color: "red" });
    }

    const createSchool = () => modals.open({
        title: "Adding a new school",
        centered: true,
        children: (
            <form onSubmit={createSchoolReq} style={{ padding: 30 }}>
                <TextInput name="name" withAsterisk label="Name" />
                <TextInput name="owner" withAsterisk label="Owner Email" />
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

            if (x === 200) notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
            else notifications.show({ title: "Failed to delete school", message: "Please contact Algorix to fix this error.", color: "red" });
        },
    });

    const editSchoolReq = async (e: any, sc: School) => {
        e.preventDefault();

        let b = {
            owner: e.target.owner.value,
            address: e.target.address.value,
            primary_color: e.target.primary_color.value,
            logo: e.target.logo.value
        }

        let s = (await fetch("/api/school/update", { method: "POST", body: JSON.stringify(b), headers: { school: String(sc.id) } })).status;

        if (s === 200) {
            modals.closeAll();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to edit school", message: "Please confirm that the owner's MyExtraDuty account has been created.", color: "red" });
    }

    const editSchool = (s: School) => modals.open({
        title: `Editing ${s.name}`,
        centered: true,
        children: (
            <form onSubmit={(e) => editSchoolReq(e, s)} style={{ padding: 30 }}>
                <TextInput name="owner" withAsterisk label="Owner Email" defaultValue={s.owner} />
                <TextInput name="address" withAsterisk label="Address" defaultValue={s.address} />
                <Select name="primary_color" withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} defaultValue={s.primary_color} />
                <TextInput name="logo" withAsterisk label="School Logo URL" defaultValue={s.logo} />

                <Group position="right" mt="md">
                    <Button type="submit">Save</Button>
                </Group>
            </form>
        )
    });

    // TODO - fixed searchbar
    // TODO - scroll only the li
    return (
        <div className={styles.container}>
            <div className={styles.gro} >
                <TextInput className={styles.inp} placeholder="School name" value={search} onChange={onSearch} />

                <Tooltip label="Add">
                    <ActionIcon className={styles.ico} variant="filled" onClick={createSchool}><IconPlus /></ActionIcon>
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