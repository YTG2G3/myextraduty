import SiteContext from "@/lib/site-context";
import { Accordion, Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import { useContext } from "react";
import GetReady from "../GetReady";
import dayjs from "dayjs";
import styles from '@/styles/AppDashboard.module.scss';
import { Assignment, Task } from "@/lib/schema";
import DynamicIcon from "../DynamicIcon";

export default function AppDashboard({ tasks, assignments, setPageIndex }: { tasks: Task[], assignments: Assignment[], setPageIndex: Function }) {
    let { school, user } = useContext(SiteContext);

    if (!school.opening_at || dayjs(school.opening_at).isAfter(dayjs())) return <GetReady />;

    let reg = assignments.filter(v => v.email === user.email);
    let upcomingEvents = tasks.filter(v => dayjs(v.ending_date + " " + v.ending_time).isAfter(dayjs()) &&
        assignments.find(vv => v.id === vv.task && vv.email === user.email));

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
                                        <div className={styles.pan}>
                                            <Text w="50%" mr="10%" color="dimmed">Description: {v.description}</Text>

                                            <div className={styles.px}>
                                                <Text>Date(s): {dayjs(v.starting_date).format("ddd, MMMM D, YYYY")} {v.starting_date !== v.ending_date ? `~ ${dayjs(v.ending_date).format("ddd, MMMM D, YYYY")}` : ""}</Text>
                                                <Text>Time: {dayjs(v.starting_time, "HH:mm").format("h:mm A")} - {dayjs(v.ending_time, "HH:mm").format("h:mm A")}</Text>
                                                <Text>Attendants: {assignments.filter(x => x.task === v.id).length}/{v.capacity}</Text>
                                            </div>
                                        </div>
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