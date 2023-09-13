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
                    <Group>
                        <Image src="/images/logo_bg.png" width={100} height={100} alt="MyExtraDuty" />
                        <Text size="100px" weight={700}>MyExtraDuty</Text>
                    </Group>

                    <Text size="40px" weight={500}>An easy way to manage your extra duties; powered by Algorix</Text>
                </div>
            </div>
        </Container>
    );
}