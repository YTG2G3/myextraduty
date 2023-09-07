import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext } from "react";
import GetReady from "../GetReady";
import { Accordion, Button, Group, Text } from "@mantine/core";
import styles from '@/styles/ManagerDashboard.module.scss';
import { Assignment, Member, Task } from "@/lib/schema";
import { IconUser } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import DynamicIcon from "../DynamicIcon";

export default function ManagerDashboard({ members, tasks, assignments }: { members: Member[], tasks: Task[], assignments: Assignment[] }) {
    let { school, user } = useContext(SiteContext);

    if (!school.opening_at || dayjs(school.opening_at).isAfter(dayjs())) return <GetReady />;

    let noAcc = members.filter(v => v.name === "");
    let notMetQ = members.filter(v => assignments.filter(vv => vv.user === v.email).length < school.quota);
    let upcomingEvents = tasks.filter(v => dayjs(v.ending_date + " " + v.ending_time).isAfter(dayjs()) &&
        assignments.find(vv => v.id === vv.task && vv.user === user.email));

    // TODO - warning & guide email
    return (
        <div className={styles.container}>
            <div className={styles.a}>
                {notMetQ.length === 0 ? (
                    <div className={styles.cen}>
                        <Text weight="bold">Everyone met quota!</Text>
                    </div>
                ) : (
                    <>
                        <Text align="center" weight="bold">{notMetQ.length} staff(s) haven&apos;t met quota.</Text>

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
                                            <Button onClick={() => notifications.show({ title: "Unsupported Feature", message: "This feature is not supported yet.", color: "red" })} color="red">Send warning email</Button>
                                        </Group>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </>
                )}
            </div>

            <div className={styles.b}>
                {noAcc.length === 0 ? (
                    <div className={styles.cen}>
                        <Text weight="bold">All members created their account!</Text>
                    </div>
                ) : (
                    <>
                        <Text align="center" weight="bold">{noAcc.length} staff(s) don&apos;t have an account.</Text>

                        <Accordion style={{ width: "100%", marginTop: 20 }}>
                            {noAcc.map((v, i) => (
                                <Accordion.Item key={i} value={v.email}>
                                    <Accordion.Control icon={<IconUser />}>
                                        <Group align='baseline'>
                                            <Text weight="bold">{v.name === "" ? "Unknown User" : v.name}</Text>
                                            <Text color="dimmed" size="sm">{v.email}</Text>
                                        </Group>
                                    </Accordion.Control>

                                    <Accordion.Panel>
                                        <Group align="center">
                                            <Button onClick={() => notifications.show({ title: "Unsupported Feature", message: "This feature is not supported yet.", color: "red" })}>Send guidance email</Button>
                                        </Group>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </>
                )}
            </div>

            <div className={styles.c}>
                {upcomingEvents.length === 0 ? (
                    <div className={styles.cen}>
                        <Text weight="bold" size="40px">No upcoming events!</Text>
                    </div>
                ) : (
                    <Accordion style={{ width: "100%" }}>
                        {upcomingEvents.map((v, i) => (
                            <Accordion.Item key={i} value={String(v.id)}>
                                <Accordion.Control icon={<DynamicIcon v={v} />}>
                                    <Group align='baseline'>
                                        <Text weight="bold">{v.name}</Text>
                                        <Text color="dimmed" size="sm">{v.category} | {v.starting_date}</Text>
                                    </Group>
                                </Accordion.Control>

                                <Accordion.Panel>
                                    <div className={styles.pan}>
                                        <Text w="50%" mr="10%" color="dimmed">{v.description}</Text>

                                        <div className={styles.px}>
                                            <Text>Date(s): {dayjs(v.starting_date).format("MMMM D, YYYY")} {v.starting_date !== v.ending_date ? `~ ${dayjs(v.ending_date).format("MMMM D, YYYY")}` : ""}</Text>
                                            <Text>Time: {v.starting_time} - {v.ending_time}</Text>
                                            <Text>Attendants: {assignments.filter(x => x.task === v.id).length}/{v.capacity}</Text>
                                        </div>
                                    </div>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
}