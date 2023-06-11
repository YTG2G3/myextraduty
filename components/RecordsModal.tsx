import { Task } from "@/lib/schema";
import SiteContext from "@/lib/site-context";
import { Accordion, Center, Loader, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import TaskModal from "./TaskModal";

export default function RecordsModal({ sid, email }: { sid: number, email: string }) {
    let [tasks, setTasks] = useState<Task[]>(undefined);
    let { school } = useContext(SiteContext);

    const loadRecords = async () => {
        let s = await (await fetch(`/api/school/member/assigned?${new URLSearchParams({ email })}`, { method: "GET", headers: { school: String(sid) } })).json();
        setTasks(s);
    }

    useEffect(() => { loadRecords() }, []);

    if (tasks === undefined) return <Center style={{ height: "300px" }}><Loader /></Center>

    if (tasks.length === 0) return <Text align="center" color="dimmed">No records found...</Text>

    return (
        <Accordion>
            {tasks.map((t, i) => (
                <Accordion.Item key={i} value={String(t.id)}>
                    <Accordion.Control>
                        <Text>{t.name}</Text>
                    </Accordion.Control>

                    <Accordion.Panel>
                        <TaskModal task={t} />
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}