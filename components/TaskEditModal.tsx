import { Task, User } from "@/lib/schema";
import { Accordion, ActionIcon, Autocomplete, Button, Center, Group, Loader, NumberInput, Text, TextInput, Textarea, Tooltip } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import styles from '@/styles/TaskEditModal.module.scss';
import { IconPlus, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export default function TaskEditModal({ task }: { task: Task }) {
    let [categories, setCategories] = useState<string[]>(undefined);
    let [attendants, setAttendants] = useState<User[]>(undefined);

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

        if (s === 200) {
            modals.closeAll();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to add task", message: "Please confirm that the form is filled out properly.", color: "red" });
    }

    const assignMember = () => modals.open({
        title: `Assign a member to ${task.name}`,
        centered: true,
        children: (
            <form onSubmit={assignMemberReq}>
                <TextInput name="email" withAsterisk label="Email" />

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

            if (x === 200) notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
            else notifications.show({ title: "Failed to remove member", message: "Please contact the developer to fix this error.", color: "red" });
        }
    });

    const saveChanges = async (e) => {
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

        if (s === 200) {
            modals.closeAll();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to edit task", message: "Please confirm that the form is filled out properly.", color: "red" });
    }

    return (
        <div>
            <div className={styles.container}>
                <form className={styles.lbox} onSubmit={saveChanges}>
                    <Autocomplete name="category" withAsterisk label="Category" data={categories} defaultValue={task.category} dropdownPosition="bottom" />

                    <TextInput name="name" withAsterisk label="Name" defaultValue={task.name} />
                    <Textarea name="description" withAsterisk label="Description" defaultValue={task.description} />

                    <DatePickerInput name="starting_date" withAsterisk label="Starting Date" defaultValue={dayjs(task.starting_date).toDate()} />
                    <TimeInput name="starting_time" withAsterisk label="Starting Time" defaultValue={task.starting_time} />

                    <DatePickerInput name="ending_date" withAsterisk label="Ending Date" defaultValue={dayjs(task.ending_date).toDate()} />
                    <TimeInput name="ending_time" withAsterisk label="Ending Time" defaultValue={task.ending_time} />

                    <NumberInput name="capacity" withAsterisk label="Capacity" min={1} defaultValue={task.capacity} />

                    <Button mt="lg" type="submit" fullWidth>Save</Button>
                </form>

                <div className={styles.rbox}>
                    <Text align="center">Attendants ({attendants.length}/{task.capacity})</Text>

                    <Accordion>
                        {attendants.map((u, i) => (
                            <Accordion.Item key={i} value={u.email}>
                                <Accordion.Control>
                                    <Text weight="bold">{u.name}</Text>
                                </Accordion.Control>

                                <Accordion.Panel>
                                    <Group position="center">
                                        <Button onClick={() => removeMember(u)} color="red" radius="lg" size="xs" leftIcon={<IconX />}>Remove</Button>
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