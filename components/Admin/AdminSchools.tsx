import { ActionIcon, Button, Container, Flex, Group, MANTINE_COLORS, Modal, Pagination, Select, TextInput, Text, Avatar, Image } from "@mantine/core";
import styles from '@/styles/AdminSchools.module.scss';
import { useState } from "react";
import { School } from "@/lib/schema";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';

export default function AdminSchools({ schools }: any) {
    let [search, setSearch] = useState("");
    let sch: School[] = schools.filter((v: School) => v.name.indexOf(search) >= 0);
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
        let s = (await fetch("/api/school", { method: "POST", body: JSON.stringify(b) })).status;

        if (s === 200) {
            close();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to add school", message: "Please confirm that the owner's MyExtraDuty account has been created.", color: "red" });
    }

    // TODO - replace select with color picker for advanced control
    return (
        <>
            <div className={styles.container}>
                <div className={styles.gro} >
                    <TextInput className={styles.inp} placeholder="School name" value={search} onChange={onSearch} />
                    <ActionIcon className={styles.ico} variant="filled" onClick={open}><IconPlus /></ActionIcon>
                </div>

                <div className={styles.li}>
                    <Pagination value={page} onChange={setPage} total={(sch.length - 1) / 10 + 1} />

                    <div className={styles.list}>
                        <Text className={styles.tt}>Name</Text>
                        <Text className={styles.tt}>Owner</Text>
                        <Text className={styles.tt}>Address</Text>
                        <Text className={styles.tt}>Primary Color</Text>

                        {sch.slice((page - 1) * 10, (page - 1) * 10 + 10).map(v => (
                            <>
                                <Text className={styles.tt} style={{ borderTop: "1px solid gray" }}>{v.name}</Text>
                                <Text className={styles.tt} style={{ borderTop: "1px solid gray" }}>{v.owner}</Text>
                                <Text className={styles.tt} style={{ borderTop: "1px solid gray" }}>{v.address}</Text>
                                <Text className={styles.tt} style={{ borderTop: "1px solid gray" }}>{v.primary_color}</Text>
                            </>
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