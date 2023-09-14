import { School, Task } from "@/lib/schema";
import { Accordion, Center, Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import TaskViewModal from "./TaskViewModal";
import DynamicIcon, { compareTime } from "./DynamicIcon";


export default function RecordsModal({ school, email }: { school: School, email: string }) {
    let [tasks, setTasks] = useState<Task[]>(undefined);

    const loadRecords = async () => {
        let s = await (await fetch(`/api/school/member/assigned?${new URLSearchParams({ email })}`, { method: "GET", headers: { school: String(school.id) } })).json();
        setTasks(s);
    }

    useEffect(() => { loadRecords() }, []);

    if (tasks === undefined) return <Center style={{ height: "300px" }}><Loader /></Center>

    let _completed = tasks.filter(t => compareTime(t) === "completed");

    return (
        <div>
            <Text>Registered: {tasks.length} / {school.quota} ({school.max_assigned})</Text>
            <Text color="dimmed" mb="lg">Completed: {_completed.length} / {school.quota} ({school.max_assigned})</Text>

            {tasks.length === 0 ? (
                <Text align="center" color="dimmed">No records found...</Text>
            ) : undefined}

            <Accordion>
                {tasks.map((t, i) => (
                    <Accordion.Item key={i} value={String(t.id)}>
                        <Accordion.Control icon={<DynamicIcon v={t} />}>
                            <Text weight="bold">{t.category}</Text>
                        </Accordion.Control>

                        <Accordion.Panel>
                            <TaskViewModal task={t} />
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}