import { Attendant, Member, Task, User } from "@/lib/schema";
import { Accordion, ActionIcon, Autocomplete, Button, Center, Group, Loader, NumberInput, Text, TextInput, Textarea, Tooltip } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import styles from '@/styles/TaskEditModal.module.scss';
import { IconPlus, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { receivedResponse } from "@/lib/received-response";

export default function TaskEditModal({ task, members }: { task: Task, members: Member[] }) {
    let [categories, setCategories] = useState<string[]>(undefined);
    let [attendants, setAttendants] = useState<Attendant[]>(undefined);

    const loadData = async () => {
        let c = await (await fetch("/api/school/categories", { method: "GET", headers: { school: String(task.school) } })).json();
        let a = await (await fetch(`/api/school/task/attendants?${new URLSearchParams({ task: String(task.id) })}`, { method: "GET", headers: { school: String(task.school) } })).json();

        setCategories(c);
        setAttendants(a);
    }

    useEffect(() => { loadData() }, []);

    if (!categories) return <Center style={{ height: "300px", width: "500px" }}><Loader /></Center>

    const assignMemberReq = async (e: any) => {
        e.preventDefault();

        let b = {
            task: task.id,
            user: e.target.email.value
        };

        let s = (await fetch("/api/school/task/assign", { method: "POST", body: JSON.stringify(b), headers: { school: String(task.school) } })).status;

        receivedResponse(s);
    }

    const assignMember = () => modals.open({
        title: `Assign a member to ${task.name}`,
        centered: true,
        children: (
            <form onSubmit={assignMemberReq}>
                <Autocomplete name="email" withAsterisk label="Email" data={members.map(v => v.email)} dropdownPosition='bottom' />

                <Group position="right" mt="md">
                    <Button type="submit">Assign</Button>
                </Group>
            </form>
        )
    });

    const removeMember = (u: User) => modals.openConfirmModal({
        title: `Are you sure about removing ${u.name} from ${task.name}?`,
        children: <Text size="sm">{u.name} will be able to sign up again manually.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
            let b = { task: task.id, user: u.email };
            let x = (await fetch("/api/school/task/kick", { method: "POST", body: JSON.stringify(b), headers: { school: String(task.school) } })).status;

            receivedResponse(x);
        }
    });

    const saveChanges = async (e: any) => {
        e.preventDefault();

        let b = {
            task: task.id,
            category: e.target.category.value,
            name: e.target.name.value,
            description: e.target.description.value,
            starting_date: dayjs(e.target.starting_date.value).format("YYYY-MM-DD"),
            starting_time: e.target.starting_time.value,
            ending_date: dayjs(e.target.ending_date.value).format("YYYY-MM-DD"),
            ending_time: e.target.ending_time.value,
            capacity: e.target.capacity.value,
        }

        let s = (await fetch("/api/school/task/update", { method: "POST", body: JSON.stringify(b), headers: { school: String(task.school) } })).status;

        receivedResponse(s);
    }

    const deleteTask = () => modals.openConfirmModal({
        title: `Are you sure about deleting ${task.name}?`,
        children: <Text size="sm">This action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
            let b = { task: task.id }
            let x = (await fetch("/api/school/task/delete", { method: "POST", body: JSON.stringify(b) })).status;

            receivedResponse(x);
        },
    });

    return (
        <div>
            <div className={styles.container}>
                <form className={styles.lbox} onSubmit={saveChanges}>
                    <Autocomplete name="category" withAsterisk label="Category" data={categories} defaultValue={task.category} dropdownPosition="bottom" />

                    <TextInput name="name" withAsterisk label="Name" defaultValue={task.name} />
                    <Textarea name="description" withAsterisk label="Description" defaultValue={task.description} />

                    <DatePickerInput name="starting_date" withAsterisk label="Starting Date" defaultValue={dayjs(task.starting_date).toDate()} />
                    <DatePickerInput name="ending_date" withAsterisk label="Ending Date" defaultValue={dayjs(task.ending_date).toDate()} />

                    <TimeInput name="starting_time" withAsterisk label="Starting Time" defaultValue={task.starting_time} />
                    <TimeInput name="ending_time" withAsterisk label="Ending Time" defaultValue={task.ending_time} />

                    <NumberInput name="capacity" withAsterisk label="Capacity" min={1} defaultValue={task.capacity} />

                    <Group position="right">
                        <Button mt="lg" color="red" onClick={deleteTask}>Delete</Button>
                        <Button mt="lg" type="submit">Save</Button>
                    </Group>
                </form>

                <div className={styles.rbox}>
                    <Text align="center">Attendants ({attendants.length}/{task.capacity})</Text>

                    <Accordion>
                        {attendants.map((u, i) => (
                            <Accordion.Item key={i} value={u.user.email}>
                                <Accordion.Control>
                                    <Text weight="bold">{u.user.name}</Text>
                                    <Text color="dimmed" size="xs">{dayjs(u.assigned_at).format("MMMM D, YYYY HH:MM:ss A")}</Text>
                                </Accordion.Control>

                                <Accordion.Panel>
                                    <Group position="center">
                                        <Button onClick={() => removeMember(u.user)} color="red" radius="lg" size="xs" leftIcon={<IconX />}>Remove</Button>
                                    </Group>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                    {attendants.length === 0 ? (
                        <Text align="center" mt="sm" color="dimmed">No one signed up for this event yet...</Text>
                    ) : undefined}

                    {attendants.length < task.capacity ? (
                        <div className={styles.float}>
                            <Tooltip label="Assign">
                                <ActionIcon variant="filled" onClick={assignMember}><IconPlus /></ActionIcon>
                            </Tooltip>
                        </div>
                    ) : undefined}
                </div>
            </div>
        </div>
    );
}