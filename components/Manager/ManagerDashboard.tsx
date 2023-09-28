import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext } from "react";
import GetReady from "../GetReady";
import { Accordion, Button, Group, Text, Tooltip } from "@mantine/core";
import styles from '@/styles/ManagerDashboard.module.scss';
import { Assignment, Member, Task } from "@/lib/schema";
import { IconUser } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import DynamicIcon from "../DynamicIcon";
import TaskViewModal from "../TaskViewModal";
import { receivedResponse } from "@/lib/received-response";

export default function ManagerDashboard({ members, tasks, assignments }: { members: Member[], tasks: Task[], assignments: Assignment[] }) {
    let { school, user } = useContext(SiteContext);

    if (!school.opening_at || dayjs().isBefore(dayjs(school.opening_at))) return <GetReady />;

    let noAcc = members.filter(v => v.name === "");
    let notMetQ = members.filter(v => assignments.filter(vv => vv.email === v.email).length < school.quota);
    let upcomingEvents = tasks.filter(v => dayjs(v.ending_date + " " + v.ending_time).isAfter(dayjs()) &&
        assignments.find(vv => v.id === vv.task && vv.email === user.email));

    const dropTask = async (t: Task) => {
        let b = { task: t.id };
        let s = (await fetch("/api/school/task/drop", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
    }

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