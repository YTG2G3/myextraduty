import { ActionIcon, Container, Group, Header, Text, Tooltip } from "@mantine/core";
import styles from '@/styles/Header.module.scss';
import { IconLogout, IconSchool } from '@tabler/icons-react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function AppHeader() {
    let router = useRouter();

    return (
        <Header height={60} p="xs">
            <Container className={styles.inner} fluid>
                <Group align="center">
                    <Image src="/images/logo_bg.png" width={40} height={40} alt="MyExtraDuty" />
                    <Text color="dimmed">Console</Text>
                </Group>

                <Group>
                    <Tooltip label="Select School">
                        <ActionIcon color="#339AF0" size="lg" onClick={() => router.push("/console/school")}><IconSchool /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Logout">
                        <ActionIcon variant="filled" color="#339AF0" size="lg" onClick={() => signOut()}><IconLogout /></ActionIcon>
                    </Tooltip>
                </Group>
            </Container>
        </Header>
    );
}