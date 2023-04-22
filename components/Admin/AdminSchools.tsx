import { ActionIcon, Button, Group, MANTINE_COLORS, Modal, Pagination, Select, TextInput, Image, Card, Text, Space } from "@mantine/core";
import styles from '@/styles/AdminSchools.module.scss';
import { useState } from "react";
import { School } from "@/lib/schema";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

export default function AdminSchools({ schools }: any) {
    let [search, setSearch] = useState("");
    let sch: School[] = schools.filter((v: School) => v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0);
    let [opened, { open, close }] = useDisclosure(false);
    let [page, setPage] = useState(1);

    let form = useForm({
        initialValues: {
            name: "",
            owner: "",
            address: "",
            primary_color: "blue",
            logo: ""
        },
        validate: {
            name: (v) => v.length > 0 ? null : "Please do not leave this empty",
            owner: (v) => v.length > 0 ? null : "Please do not leave this empty",
            address: (v) => v.length > 0 ? null : "Please do not leave this empty",
            logo: (v) => v.length > 0 ? null : "Please do not leave this empty",
        }
    });

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setPage(1);
        setSearch(str);
    }

    const createSchool = async (b: any) => {
        let s = (await fetch("/api/school/create", { method: "POST", body: JSON.stringify(b) })).status;

        if (s === 200) {
            close();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to add school", message: "Please confirm that the owner's MyExtraDuty account has been created.", color: "red" });
    }

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
    })

    // TODO - check if pagination works correctly
    // TODO - replace select with color picker for advanced control
    return (
        <>
            <div className={styles.container}>
                <div className={styles.gro} >
                    <TextInput className={styles.inp} placeholder="School name" value={search} onChange={onSearch} />
                    <ActionIcon className={styles.ico} variant="filled" onClick={open}><IconPlus /></ActionIcon>
                </div>

                <div className={styles.li}>
                    <Group>
                        <Pagination value={page} onChange={setPage} total={(sch.length - 1) / 10 + 1} />
                        <Text size="sm" color="dimmed">Displaying 10 per page</Text>
                    </Group>

                    <div className={styles.list}>
                        {sch.slice((page - 1) * 10, (page - 1) * 10 + 10).map((v, i) => (
                            <Card key={i} style={{ width: 300 }} shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section>
                                    <Image src={v.logo} height={160} alt={v.name} fit="cover" />
                                </Card.Section>

                                <Group position="apart" mt="md" mb="xs">
                                    <Text weight={500}>{v.name}</Text>
                                </Group>

                                <Text size="sm" color="dimmed">Owned by {v.owner}</Text>
                                <Text size="sm" color="dimmed">{v.address}</Text>

                                <Space h="md" />

                                <Group position="right">
                                    <ActionIcon><IconEdit /></ActionIcon>
                                    <ActionIcon onClick={() => deleteSchool(v)}><IconTrash color="red" /></ActionIcon>
                                </Group>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <Modal opened={opened} onClose={close} title="Create a New School" centered>
                <form onSubmit={form.onSubmit(createSchool)} style={{ padding: 30 }}>
                    <TextInput withAsterisk label="Name" {...form.getInputProps('name')} />
                    <TextInput withAsterisk label="Owner Email" {...form.getInputProps('owner')} />
                    <TextInput withAsterisk label="Address" {...form.getInputProps('address')} />
                    <Select withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} {...form.getInputProps('primary_color')} />
                    <TextInput withAsterisk label="School Logo URL" {...form.getInputProps('logo')} />

                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>
        </>
    );
}