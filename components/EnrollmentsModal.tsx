import { receivedResponse } from "@/lib/received-response";
import { Enrollment, School, Profile } from "@/lib/schema";
import { Accordion, Autocomplete, Button, Center, Group, Loader, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconShieldStar, IconUser, IconUserCog } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function EnrollmentsModal({ user, sc }: { user: Profile, sc: School[] }) {
    let [enrollments, setEnrollments] = useState<Enrollment[]>(undefined);
    let [schools, setSchools] = useState<School[]>(undefined);

    const loadEnrollments = async () => {
        let e: Enrollment[] = await (await fetch(`/api/user/enrollment?${new URLSearchParams({ email: user.email })}`, { method: "GET" })).json();
        setEnrollments(e);

        let s: School[] = [];
        for (let { school } of e) s.push(await (await fetch(`/api/school`, { headers: { school: String(school) } })).json());
        setSchools(s);
    }

    const enrollUserReq = async (e: any) => {
        e.preventDefault();

        let b = { email: user.email };
        let s = (await fetch("/api/school/member", { method: "POST", body: JSON.stringify(b), headers: { school: e.target.school.value.substring(e.target.school.value.lastIndexOf("|") + 2) } })).status;

        receivedResponse(s);
    }

    const enrollUser = () => modals.open({
        title: `Enroll ${user.name}`,
        children: (
            <form onSubmit={enrollUserReq}>
                <Autocomplete name="school" data={sc.filter(c => !schools.find(x => x.id === c.id)).map(v => `${v.name} | ${v.id}`)} dropdownPosition="bottom" />

                <Group position="right" mt="md">
                    <Button type="submit">Enroll</Button>
                </Group>
            </form>
        ),
        centered: true
    });

    useEffect(() => { loadEnrollments() }, []);

    if (schools === undefined) return <Center style={{ height: "300px" }}><Loader /></Center>

    return (
        <div>
            {schools.length === 0 ? (
                <Text align="center" color="dimmed">No records found...</Text>
            ) : undefined}

            <Button onClick={enrollUser}>Enroll</Button>

            <Accordion>
                {schools.map((s, i) => (
                    <Accordion.Item key={i} value={String(s.id)}>
                        <Accordion.Control icon={
                            s.owner === user.email ? (
                                <Tooltip label="Owner">
                                    <IconShieldStar color="green" />
                                </Tooltip>
                            ) : enrollments[i].manager ? (
                                <Tooltip label="Manager">
                                    <IconUserCog color="blue" />
                                </Tooltip>
                            ) : (
                                <IconUser />
                            )
                        }>
                            <Text weight="bold">{s.name}</Text>
                        </Accordion.Control>

                        <Accordion.Panel>

                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}