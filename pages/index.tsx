import { Button, Container, Group, Header, Text } from "@mantine/core";
import { signIn } from "next-auth/react";
import styles from '@/styles/Home.module.scss';
import { useContext } from "react";
import SiteContext from "@/lib/site-context";
import Link from "next/link";

export default function Home() {
    let { user } = useContext(SiteContext);

    // TODO - logo and design
    return (
        <Container fluid>
            <Header height={60}>
                <Container className={styles.inner} fluid>
                    <Group>
                        <Text>MyExtraDuty</Text>
                    </Group>

                    <Group>
                        {user ? (
                            <Link href="/console">
                                <Button variant="outline" radius="xl" h={30}>Console</Button>
                            </Link>
                        ) : (
                            <Button variant="gradient" radius="xl" h={30} onClick={() => signIn("google")}>Login</Button>
                        )}
                    </Group>
                </Container>
            </Header>
        </Container>
    );
}