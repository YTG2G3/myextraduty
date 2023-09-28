import { Button, Container, Group, Header, Text } from "@mantine/core";
import { signIn } from "next-auth/react";
import styles from '@/styles/Home.module.scss';
import { useContext } from "react";
import SiteContext from "@/lib/site-context";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    let { user } = useContext(SiteContext);

    return (
        <Container fluid>
            <Header height={60}>
                <Container className={styles.inner} fluid>
                    <Image src="/images/logo_bg.png" width={40} height={40} alt="MyExtraDuty" />

                    <Group>
                        {user ? (
                            <Link href="/console">
                                <Button variant="outline" radius="xl" h={30}>Console</Button>
                            </Link>
                        ) : (
                            <Button variant="gradient" radius="xl" h={30} onClick={() => signIn("google", { callbackUrl: "/console/app" })}>Login</Button>
                        )}
                    </Group>
                </Container>
            </Header>

            <div className={styles.hero}>
                <div className={styles.i}>
                    <Text size="100px" weight={700}>MyExtraDuty</Text>
                    <Text size="40px" weight={500}>📅 An easy way to manage your extra duties. Powered by Algorix.</Text>
                </div>
            </div>
        </Container>
    );
}