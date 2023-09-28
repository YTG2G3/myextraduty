import SiteContext from "@/lib/site-context";
import { Accordion, Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import { useContext } from "react";
import GetReady from "../GetReady";
import dayjs from "dayjs";
import styles from '@/styles/AppDashboard.module.scss';
import { Assignment, Task } from "@/lib/schema";
import DynamicIcon from "../DynamicIcon";
import TaskViewModal from "../TaskViewModal";
import { receivedResponse } from "@/lib/received-response";

export default function AppDashboard({ tasks, assignments, setPageIndex }: { tasks: Task[], assignments: Assignment[], setPageIndex: Function }) {
    let { school, user } = useContext(SiteContext);

    if (!school.opening_at || dayjs().isBefore(dayjs(school.opening_at))) return <GetReady />;

    let reg = assignments.filter(v => v.email === user.email);
    let upcomingEvents = tasks.filter(v => dayjs(v.ending_date + " " + v.ending_time).isAfter(dayjs()) &&
        assignments.find(vv => v.id === vv.task && vv.email === user.email));

    const dropTask = async (t: Task) => {
        let b = { task: t.id };
        let s = (await fetch("/api/school/task/drop", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
    }

    return (
        <div className={styles.container}>
            <div className={styles.a}>
                <div className={styles.cen}>
                    {reg.length < school.quota ? (
                        <Stack>
                            <Text weight="bold" align="center">{school.quota - reg.length} more to go!</Text>
                            <Text size="xl" color="dimmed" align="center">{reg.length}/{school.quota} registered</Text>
                        </Stack>
                    ) : (
                        <Stack>
                            <Text weight="bold">Quota met!</Text>
                            <Text size="xl" color="dimmed" align="center">{reg.length}/{school.quota} registered</Text>
                        </Stack>
                    )}
                </div>
            </div>

            <div className={styles.b}>
                {upcomingEvents.length === 0 ? (
                    <div className={styles.cen}>
                        <Stack>
                            <Text weight="bold" size="40px">No any upcoming events!</Text>
                            <Button p="lg" m="lg" size="20px" onClick={() => setPageIndex(1)}>Go sign up for more events!</Button>
                        </Stack>
                    </div>
                ) : (
                    <Accordion style={{ width: "100%" }}>
                        {upcomingEvents.map((v, i) => (
                            <Tooltip key={i} label={v.description.substring(0, 30)} position='left'>
                                <Accordion.Item key={i} value={String(v.id)}>
                                    <Accordion.Control icon={<DynamicIcon v={v} />}>
                                        <Group align='baseline'>
                                            <Text weight="bold">{v.category}</Text>
                                            <Text color="dimmed" size="sm">{v.location} | {dayjs(v.starting_date).format("dddd, MMMM D, YYYY")}</Text>
                                        </Group>
                                    </Accordion.Control>

                                    <Accordion.Panel>
                                        <TaskViewModal task={v} />
                                        <Button disabled={!school.drop_enabled} onClick={() => dropTask(v)} color="red">Drop</Button>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Tooltip>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
}