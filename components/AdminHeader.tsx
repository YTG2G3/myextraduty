import { ActionIcon, Container, Group, Header, Text, Tooltip } from "@mantine/core";
import styles from '@/styles/AdminHeader.module.scss';
import { IconLogout, IconSchool } from '@tabler/icons-react';

export default function AdminHeader() {
    // TODO - design
    return (
        <Header height={60} p="xs">
            <Container className={styles.inner} fluid>
                <Group>
                    <Text>MyExtraDuty Admin</Text>
                </Group>

                <Group>
                    <Tooltip label="Select School">
                        <ActionIcon color="#339AF0" size="lg"><IconSchool /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Logout">
                        <ActionIcon variant="filled" color="#339AF0" size="lg"><IconLogout /></ActionIcon>
                    </Tooltip>
                </Group>
            </Container>
        </Header>
    );
}