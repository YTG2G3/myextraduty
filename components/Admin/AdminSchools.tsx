import { ActionIcon, Center, Container, Flex, Group, Modal, Pagination, Stack, Text, TextInput } from "@mantine/core";
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
            domain: "",
            owner: "",
            address: "",
            primary_color: "blue",
            logo: ""
        },
        validate: {
            name: (v) => v.length > 0 ? null : "Please do not leave this empty",
            domain: (v) => v.length > 0 ? !v.startsWith("@") ? null : "Please remove '@'" : "Please do not leave this empty",
            owner: (v) => v.length > 0 ? null : "Please do not leave this empty",
            address: (v) => v.length > 0 ? null : "Please do not leave this empty",
        }
    });

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str);
    }

    const createSchool = (sd: any) => {
        let s: School = {
            ...sd
        }
    }

    return (
        <>
            <Container fluid className={styles.container}>
                <Flex className={styles.pad} direction="column" justify="center">
                    <Group className={styles.gro} align="center">
                        <TextInput className={styles.inp} placeholder="School name" value={search} onChange={onSearch} />
                        <ActionIcon className={styles.ico} variant="filled" onClick={open}><IconPlus /></ActionIcon>
                    </Group>

                    {sch.length > 0 ? (
                        <>
                            <Pagination total={sch.length / 10} />
                        </>
                    ) : (
                        <Text m="lg">Add a new school to start!</Text>
                    )}
                </Flex>
            </Container>

            <Modal opened={opened} onClose={close} title="Create a New School" centered>
                <form onSubmit={form.onSubmit(createSchool)}>

                </form>
            </Modal>
        </>
    );
}