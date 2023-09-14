import SiteContext from "@/lib/site-context";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import styles from '@/styles/ManagerTasks.module.scss';
import { Accordion, ActionIcon, Autocomplete, Button, Group, Text, Tooltip } from "@mantine/core";
import { IconUserCancel } from "@tabler/icons-react";
import DynamicIcon from "../DynamicIcon";
import { Assignment, Task } from "@/lib/schema";
import { receivedResponse } from "@/lib/received-response";

// TODO - calendar view
export default function AppTasks({ tasks, categories, assignments }: { tasks: Task[], categories: string[], assignments: Assignment[] }) {
    let { school, user } = useContext(SiteContext);
    let [search, setSearch] = useState("");
    let [tg, setTg] = useState(true);

    const searchForTask = (v: Task) => (
        (v.category.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.location.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.starting_date.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.ending_date.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
        !(assignments.filter(vv => vv.task === v.id).length >= v.capacity && !tg)
    );

    let t: Task[] = tasks.filter(t => dayjs(t.ending_date + " " + t.ending_time).isAfter(dayjs())).filter(searchForTask);

    const onSearch = (s: string) => {
        setSearch(s.trim());
    }

    const registerTask = async (t: Task) => {
        let b = { task: t.id };

        let s = (await fetch("/api/school/task/register", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
    }

    const dropTask = async (t: Task) => {
        let b = { task: t.id };
        let s = (await fetch("/api/school/task/drop", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
    }

    return (
        <div className={styles.container}>
            <div className={styles.gro} >
                <Autocomplete style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} data={categories} />

                <div className={styles.wr}>
                    <Tooltip label="Toggle Filled">
                        <ActionIcon variant={tg ? "filled" : "outline"} onClick={() => setTg(!tg)}><IconUserCancel /></ActionIcon>
                    </Tooltip>
                </div>
            </div>

            <Accordion style={{ width: "100%", marginTop: 20 }}>
                {t.map((v, i) => (
                    <Tooltip key={i} label={v.description.substring(0, 30)} position='left'>
                        <Accordion.Item key={i} value={String(v.id)}>
                            <Accordion.Control icon={<DynamicIcon v={v} />}>
                                <Group align='baseline'>
                                    <Text weight="bold">{v.category}</Text>
                                    <Text color="dimmed" size="sm">{v.location} | {v.starting_date}</Text>
                                </Group>
                            </Accordion.Control>

                            <Accordion.Panel>
                                <div className={styles.pan}>
                                    <Text w="50%" mr="10%" color="dimmed">Description: {v.description}</Text>

                                    <div className={styles.px}>
                                        <Text>Date(s): {dayjs(v.starting_date).format("MMMM D, YYYY")} {v.starting_date !== v.ending_date ? `~ ${dayjs(v.ending_date).format("MMMM D, YYYY")}` : ""}</Text>
                                        <Text>Time: {dayjs(v.starting_time, "HH:mm").format("h:mm A")} - {dayjs(v.ending_time, "HH:mm").format("h:mm A")}</Text>
                                        <Text>Attendants: {assignments.filter(x => x.task === v.id).length}/{v.capacity}</Text>

                                        {!school.opening_at || dayjs(school.opening_at).isAfter(dayjs()) ? <></> : (
                                            <Group mt="md">
                                                {assignments.find(x => x.email === user.email && x.task === v.id) ? (
                                                    <Button onClick={() => dropTask(v)} color="red">Drop</Button>
                                                ) : (
                                                    <Button disabled={assignments.filter(x => x.task === v.id).length >= v.capacity || assignments.filter(x => x.email === user.email).length >= school.quota} onClick={() => registerTask(v)}>Register</Button>
                                                )}
                                            </Group>
                                        )}
                                    </div>
                                </div>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Tooltip>
                ))}
            </Accordion>
        </div>
    );
}