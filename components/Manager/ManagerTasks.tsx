import { Assignment, Member, Task } from '@/lib/schema';
import SiteContext from '@/lib/site-context';
import styles from '@/styles/ManagerTasks.module.scss';
import { Accordion, ActionIcon, Autocomplete, Button, Group, NumberInput, Space, Text, TextInput, Textarea, Tooltip, rem, useMantineTheme } from '@mantine/core';
import { IconDownload, IconFile, IconHistory, IconPlus, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { CSVLink } from 'react-csv';
import { modals } from "@mantine/modals";
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import Papa from 'papaparse';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import TaskEditModal from '../TaskEditModal';
import DynamicIcon from '../DynamicIcon';
import { receivedRatioResponse, receivedResponse } from '@/lib/received-response';

export default function ManagerTasks({ tasks, categories, assignments, members }: { tasks: Task[], categories: string[], assignments: Assignment[], members: Member[] }) {
    let [search, setSearch] = useState("");
    let [past, setPast] = useState(true);
    let { school, user } = useContext(SiteContext);
    const theme = useMantineTheme();

    const searchForTask = (v: Task) => (
        (v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.category.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.starting_date.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.ending_date.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
        !(dayjs(v.ending_date + " " + v.ending_time) < dayjs() && !past)
    );

    let t: Task[] = tasks.filter(searchForTask);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str.trim());
    }

    const addTaskReq = async (e: any) => {
        e.preventDefault();

        let b = {
            category: e.target.category.value,
            name: e.target.name.value,
            description: e.target.description.value,
            starting_date: dayjs(e.target.starting_date.value).format("YYYY-MM-DD"),
            starting_time: e.target.starting_time.value,
            ending_date: dayjs(e.target.ending_date.value).format("YYYY-MM-DD"),
            ending_time: e.target.ending_time.value,
            capacity: e.target.capacity.value,
        };

        let s = (await fetch("/api/school/task/create", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
    }

    const addTask = () => modals.open({
        title: `Add new task`,
        centered: true,
        children: (
            <form onSubmit={addTaskReq}>
                <Autocomplete name="category" withAsterisk label="Category" data={categories} dropdownPosition='bottom' />

                <TextInput name="name" withAsterisk label="Name" />
                <Textarea name="description" withAsterisk label="Description" />

                <DatePickerInput name="starting_date" withAsterisk label="Starting Date" />
                <DatePickerInput name="ending_date" withAsterisk label="Ending Date" />

                <TimeInput name="starting_time" withAsterisk label="Starting Time" />
                <TimeInput name="ending_time" withAsterisk label="Ending Time" />

                <NumberInput name="capacity" withAsterisk label="Capacity" min={1} defaultValue={1} />

                <Group position="right" mt="md">
                    <Button type="submit">Add</Button>
                </Group>
            </form>
        )
    });

    const uploadTasksReq = async (files: FileWithPath[]) => {
        let file = files[0];

        Papa.parse(file, {
            complete: async ({ data: tasks }) => {
                let t = tasks as String[][];
                t.shift();

                // TODO - validating dates so that starting < ending
                // TODO - repetitive events are considered as one (incrementing capcity)
                let b = { tasks: t.map(v => ({ category: v[0], name: v[1], description: v[2], starting_date: v[3], ending_date: v[4], starting_time: v[5], ending_time: v[6], capacity: v[7] })) };
                let s = await (await fetch("/api/school/task/multi", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).json();

                receivedRatioResponse(s.success, s.requested);
            }
        });
    }

    const uploadTasks = () => modals.open({
        title: `Upload Tasks`,
        centered: true,
        children: (
            <div>
                <Text color='red'>* Columns must be in order of <b>Category, Name, Description, Starting Date, Ending Date, Starting Time, Ending Time, Capacity</b></Text>
                <Text color='red'>* Dates must be in YYYY-MM-DD format</Text>
                <Text color='red'>* Time must be in HH:MM format</Text>

                <Space h="md" />

                <Dropzone onDrop={uploadTasksReq} accept={["text/csv"]} multiple={false}>
                    <Group position="center" spacing="xl" style={{ minHeight: rem(220), pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <IconUpload
                                size="3.2rem"
                                stroke={1.5}
                                color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                            />
                        </Dropzone.Accept>

                        <Dropzone.Reject>
                            <IconX
                                size="3.2rem"
                                stroke={1.5}
                                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                            />
                        </Dropzone.Reject>

                        <Dropzone.Idle>
                            <IconFile size="3.2rem" stroke={1.5} />
                        </Dropzone.Idle>

                        <div>
                            <Text size="xl" inline>
                                Drag the file here or click to select file
                            </Text>

                            <Text size="sm" color="dimmed" inline align="center" mt={7}>
                                *.csv files accepted
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
            </div>
        )
    });

    const openTaskModal = (t: Task) => modals.open({
        title: `Editing ${t.name}`,
        centered: true,
        size: "fit-content",
        children: <TaskEditModal task={t} members={members} />
    });

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

    const clearTasks = () => modals.openConfirmModal({
        title: "Are you sure about clearing tasks?",
        children: <Text size="sm">This action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        color: "red",
        onConfirm: async () => {
            let x = (await fetch("/api/school/task/clear", { method: "POST", headers: { school: String(school.id) } })).status;
            receivedResponse(x);
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.gro} >
                <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />

                <div className={styles.wr}>
                    <Tooltip label="Add">
                        <ActionIcon variant="filled" mr="xs" onClick={addTask}><IconPlus /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Upload">
                        <ActionIcon variant="filled" mr="xs" onClick={uploadTasks}><IconUpload /></ActionIcon>
                    </Tooltip>

                    <CSVLink style={{ marginRight: 10 }} data={[["Category", "Name", "Description", "Starting Date", "Ending Date", "Starting Time", "Ending Time", "Capacity"], ...tasks.map(v => [v.category, v.name, v.description, v.starting_date, v.ending_date, v.starting_time, v.ending_time, v.capacity])]} filename={`${school.name} tasks (${new Date().getUTCFullYear()})`}>
                        <Tooltip label="Download">
                            <ActionIcon variant="filled"><IconDownload /></ActionIcon>
                        </Tooltip>
                    </CSVLink>

                    <Tooltip label="Toggle Completed">
                        <ActionIcon mr="xs" variant={past ? "filled" : "outline"} onClick={() => setPast(!past)}><IconHistory /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Clear All">
                        <ActionIcon variant="filled" color="red" onClick={clearTasks}><IconTrash /></ActionIcon>
                    </Tooltip>
                </div>
            </div>

            <Accordion style={{ width: "100%", marginTop: 20 }}>
                {t.map((v, i) => (
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

                                    <Group mt="md">
                                        {assignments.find(x => x.user === user.email && x.task === v.id) ? (
                                            <Button onClick={() => dropTask(v)} color="red">Drop</Button>
                                        ) : (
                                            <Button disabled={assignments.filter(x => x.task === v.id).length >= v.capacity || assignments.filter(x => x.user === user.email).length >= school.quota} onClick={() => registerTask(v)}>Register</Button>
                                        )}

                                        <Button onClick={() => openTaskModal(v)}>Manage</Button>
                                    </Group>
                                </div>
                            </div>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}