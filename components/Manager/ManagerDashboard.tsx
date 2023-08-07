import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext } from "react";
import GetReady from "../GetReady";
import { Accordion, Button, Group, Text } from "@mantine/core";
import styles from '@/styles/ManagerDashboard.module.scss';
import { Assignment, Member, Task } from "@/lib/schema";
import { IconUser } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

// TODO - upcoming events, quota, status of members
export default function ManagerDashboard({ members, tasks, assignments }: { members: Member[], tasks: Task[], assignments: Assignment[] }) {
    let { school } = useContext(SiteContext);

    if (!school.opening_at) return <Text>To start the countdown, please set the opening date in settings.</Text>

    if (dayjs(school.opening_at).isAfter(dayjs())) return <GetReady />;

    let notMetQ = members.filter(v => assignments.filter(vv => vv.user === v.email).length < school.quota);

    // TODO - warning email
    return (
        <div className={styles.container}>
            <div className={styles.a}>
                <Text align="center" weight="bold">{notMetQ.length === 0 ? "Everyone met quota!" : `${notMetQ.length} staff(s) haven't met quota.`}</Text>

                <Accordion style={{ width: "100%", marginTop: 20 }}>
                    {notMetQ.map((v, i) => (
                        <Accordion.Item key={i} value={v.email}>
                            <Accordion.Control icon={<IconUser />}>
                                <Group align='baseline'>
                                    <Text weight="bold">{v.name === "" ? "Unknown User" : v.name}</Text>
                                    <Text color="dimmed" size="sm">{v.email}</Text>
                                </Group>
                            </Accordion.Control>

                            <Accordion.Panel>
                                <Group align="center">
                                    <Button onClick={() => notifications.show({ title: "Unsupported Feature", message: "This feature is not supported yet.", color: "red" })}>Send warning email</Button>
                                </Group>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>

            <div className={styles.b}>
                <p>ADaSSD</p>
            </div>

            <div className={styles.c}>
                <p>ADaSSD</p>
            </div>
        </div>
    );
}