import { ActionIcon, Button, Center, Container, Flex, Group, MANTINE_COLORS, Modal, Pagination, Select, Stack, Text, TextInput } from "@mantine/core";
import styles from '@/styles/AdminSchools.module.scss';
import { useState } from "react";
import { School } from "@/lib/schema";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

export default function AdminSchools({ schools }: any) {
    let [search, setSearch] = useState("");
    let sch: School[] = schools.filter((v: School) => v.name.indexOf(search) >= 0);
    let [opened, { open, close }] = useDisclosure(false);

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
        setSearch(str);
    }

    const createSchool = async (body: any) => {
        let s = (await fetch("/api/school", { method: "POST", body })).status;

        if (s === 200) {
            close();
            alert("Success! Wait a bit to bit applied"); // TODO - alert to wait 10 sec
        }
        else alert("Fail"); // TODO - alert error
    }

    // TODO - replace select with color picker for advanced control
    return (
        <>
            <Container fluid className={styles.container}>
                <Flex className={styles.pad} direction="column" justify="center">
                    <Group className={styles.gro} align="center">
                        <TextInput className={styles.inp} placeholder="School name" value={search} onChange={onSearch} />
                        <ActionIcon className={styles.ico} variant="filled" onClick={open}><IconPlus /></ActionIcon>
                    </Group>

                    <Pagination total={sch.length / 10} />
                </Flex>
            </Container>

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