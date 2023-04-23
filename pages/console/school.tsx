import { Button, Card, Center, Flex, Group, Image, ScrollArea, Text, Tooltip } from "@mantine/core";
import styles from '@/styles/School.module.scss';
import { useEffect, useState, useContext } from "react";
import { signIn, useSession } from "next-auth/react";
import { Enrollment, School } from "@/lib/schema";
import LoadingPage from "@/components/LoadingPage";
import { useRouter } from "next/router";
import SiteContext from "@/lib/site-context";

export default function SchoolSelection() {
    let { user } = useContext(SiteContext);
    let [enrollments, setEnrollments] = useState<Enrollment[]>(undefined);
    let [schools, setSchools] = useState<School[]>(undefined);
    let router = useRouter();
    let { status } = useSession();

    useEffect(() => { loadData() }, []);

    if (status === "unauthenticated") {
        signIn();
        return <></>;
    }

    // TODO - Quicker load with sync instead of async
    const loadData = async () => {
        // Enrollment
        let er = await (await fetch("/api/user/enrollment")).json();

        // Schools based on enrollments
        let s: School[] = [];
        for (let { school } of er) s.push(await (await fetch(`/api/school`, { headers: { school } })).json());

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
            {schools.length > 0 ? <Text>Select your school</Text> : undefined}

            <ScrollArea w="80%">
                <Flex justify="center" align="center" direction="row" wrap="nowrap">
                    {schools.length > 0 ? schools.map((v, i) => (
                        <Card m="lg" style={{ width: 300 }} key={i} shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section>
                                <Image src={v.logo} height={160} width={300} alt={v.name} />
                            </Card.Section>

                            <Group position="apart" mt="md" mb="xs" className={styles.wr}>
                                <Tooltip label={v.name}>
                                    <Text className={styles.t1} color={v.primary_color}>{v.name}</Text>
                                </Tooltip>

                                <Tooltip label={v.address}>
                                    <Text className={styles.t2} color={v.primary_color}>{v.address}</Text>
                                </Tooltip>
                            </Group>

                            {v.id === JSON.parse(localStorage.getItem("school")) ? (
                                <Text>Currently Selected</Text>
                            ) : undefined}

                            <Button color={v.primary_color} fullWidth mt="md" radius="md" onClick={() => selectSchool(i)}>{
                                v.owner === user.email ? "Administer" :
                                    enrollments[i].manager ? "Manage" : "Select"
                            }</Button>
                        </Card>
                    )) : (
                        <>
                            <Text>No schools associated with this account.</Text>
                            <Button variant="outline" radius="xl" compact onClick={() => signIn("google")}>Try another account</Button>
                        </>
                    )}
                </Flex>
            </ScrollArea>

            {user.admin ? (
                <Button onClick={() => router.push("/console/admin")}>Admin Portal</Button>
            ) : undefined}
        </Center>
    );
}