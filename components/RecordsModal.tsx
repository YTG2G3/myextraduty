import { Profile, School, Task } from "@/lib/schema";
import { Accordion, Button, Center, Group, Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import TaskViewModal from "./TaskViewModal";
import DynamicIcon, { compareTime } from "./DynamicIcon";
import { modals } from "@mantine/modals";
import { receivedResponse } from "@/lib/received-response";
import { IconX } from "@tabler/icons-react";

export default function RecordsModal({ school, user }: { school: School, user: Profile }) {
    let [tasks, setTasks] = useState<Task[]>(undefined);

    const loadRecords = async () => {
        let s = await (await fetch(`/api/school/member/assigned?${new URLSearchParams({ email: user.email })}`, { method: "GET", headers: { school: String(school.id) } })).json();
        setTasks(s);
    }

    useEffect(() => { loadRecords() }, []);

    if (tasks === undefined) return <Center style={{ height: "300px" }}><Loader /></Center>

    let _completed = tasks.filter(t => compareTime(t) === "completed");

    const removeMember = (tid: number) => modals.openConfirmModal({
        title: `Are you sure about removing ${user.name}?`,
        children: <Text size="sm">{user.name} will be able to sign up again manually.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
            let b = { task: tid, user: user.email };
            let x = (await fetch("/api/school/task/kick", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

            receivedResponse(x);
        }
    });

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

                            <Group position="center">
                                <Button onClick={() => removeMember(t.id)} color="red" radius="lg" size="xs" leftIcon={<IconX />}>Remove</Button>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}