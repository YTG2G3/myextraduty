import { Button, Card, Center, Flex, Group, Image, ScrollArea, Text, Tooltip } from "@mantine/core";
import styles from '@/styles/School.module.scss';
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Enrollment, School } from "@/lib/schema";
import LoadingPage from "@/components/LoadingPage";
import { useRouter } from "next/router";

export default function SchoolSelection() {
    let [enrollments, setEnrollments] = useState<Enrollment[]>(undefined);
    let [schools, setSchools] = useState<School[]>(undefined);
    let router = useRouter();
    let { status } = useSession();

    useEffect(() => { loadData() }, []);

    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    const loadData = async () => {
        // Enrollment
        let er = await (await fetch("/api/user/enrollment")).json();

        // Schools based on enrollments
        let s: School[] = [];
        for (let { school } of er) s.push(await (await fetch(`/api/school?${new URLSearchParams({ school })}`)).json());

        // Save
        setEnrollments(er);
        setSchools(s);
    }

    const selectSchool = (index: number) => {
        let s = schools[index];
        localStorage.setItem("school", JSON.stringify(s.id));
        router.push("/console/dashboard");
    }

    if (!schools) return <LoadingPage />

    // TODO - design
    return (
        <Center className={styles.page}>
            <Text>Select your school</Text>

            <ScrollArea w="80%">
                <Flex gap="md" justify="center" align="center" direction="row" wrap="nowrap">
                    {schools.length > 0 ? schools.map((v, i) => (
                        <Card className={styles.card} key={i} shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section>
                                <Image src={v.logo} height={160} width={300} alt={v.name} />
                            </Card.Section>

                            <Group position="apart" mt="md" mb="xs" className={styles.wr}>
                                <Tooltip label={v.name}>
                                    <Text className={styles.t1} color={v.primary_color}>{v.name}</Text>
                                </Tooltip>

                                <Tooltip label={v.domain}>
                                    <Text className={styles.t2} color={v.primary_color}>@{v.domain}</Text>
                                </Tooltip>
                            </Group>

                            {enrollments[i].is_manager ? (
                                <Text color="blue">Manager</Text>
                            ) : undefined}

                            {v.id === JSON.parse(localStorage.getItem("school")) ? (
                                <Text>Currently Selected</Text>
                            ) : undefined}

                            <Button color={v.primary_color} fullWidth mt="md" radius="md" onClick={() => selectSchool(i)}>Select</Button>
                        </Card>
                    )) : (
                        <>
                            <Text>No schools associated with this account.</Text>
                            <Button variant="outline" radius="xl" compact onClick={() => signIn("google")}>Try another account</Button>
                        </>
                    )}
                </Flex>
            </ScrollArea>
        </Center>
    );
}