import { Button, Container, Header, Text } from "@mantine/core";
import { signIn } from "next-auth/react";
import styles from '@/styles/Home.module.scss';

export default function Home() {
    // TODO - logo and design
    return (
        <Container fluid>
            <Header height={60}>
                <Container className={styles.inner} fluid>
                    <Text>MyExtraDuty</Text>
                    <Button radius="xl" h={30} onClick={() => signIn("google")}>Login</Button>
                </Container>
            </Header>
        </Container>
    );
}