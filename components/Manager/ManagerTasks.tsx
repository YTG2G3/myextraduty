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
import { receivedResponse } from '@/lib/received-response';
import { notifications } from '@mantine/notifications';

export default function ManagerTasks({ tasks, categories, assignments, members }: { tasks: Task[], categories: string[], assignments: Assignment[], members: Member[] }) {
    let [search, setSearch] = useState("");
    let [past, setPast] = useState(true);
    let [isLoading, setIsLoading] = useState(false);
    let { school, user } = useContext(SiteContext);
    const theme = useMantineTheme();

    const searchForTask = (v: Task) => (
        (v.category.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.location.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.starting_date.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.ending_date.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
        !(dayjs(v.ending_date + " " + v.ending_time) < dayjs() && !past)
    );

    let t: Task[] = tasks.filter(searchForTask);

    const onSearch = (s: string) => {
        setSearch(s.trim());
    }

    const addTaskReq = async (e: any) => {
        e.preventDefault();

        let b = {
            category: e.target.category.value,
            location: e.target.location.value,
            description: e.target.description.value,
            starting_date: dayjs(e.target.starting_date.value).format("YYYY-MM-DD"),
            ending_date: dayjs(e.target.ending_date.value).format("YYYY-MM-DD"),
            starting_time: e.target.starting_time.value,
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

                <TextInput name="location" withAsterisk label="Location" />
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
                modals.closeAll();
                let x = tasks as String[][];
                x.shift();

                let t = x.map(v => ({
                    category: v[0],
                    location: v[1],
                    description: v[2],
                    starting_date: v[3],
                    ending_date: v[4] === "" ? v[3] : v[4],
                    starting_time: v[5],
                    ending_time: v[6],
                    capacity: isNaN(Number(v[7])) ? 1 : Number(v[7])
                })).filter(v => v.category !== "" && v.starting_date !== "" && v.ending_date !== "" && v.starting_time !== "" && v.ending_time !== "");

                notifications.show({
                    id: "uploading-tasks",
                    title: "Uploading tasks... Please leave the page open.",
                    loading: true,
                    autoClose: false,
                    withCloseButton: false,
                    message: `Pending: ${t.length} | Success: 0 | Failed: 0`
                });

                let s = 0, f = 0;
                for (let v of t) {
                    try {
                        let x = (await fetch("/api/school/task/create", { method: "POST", body: JSON.stringify(v), headers: { school: String(school.id) } })).status;

                        if (x === 200) s++;
                        else throw null;
                    } catch (error) {
                        f++;
                    }

                    notifications.update({
                        id: "uploading-tasks",
                        title: "Uploading tasks... Please leave the page open.",
                        loading: true,
                        autoClose: false,
                        withCloseButton: false,
                        message: `Pending: ${t.length - s - f} | Success: ${s} | Failed: ${f}`
                    });
                }

                notifications.update({
                    id: "uploading-tasks",
                    title: "Upload complete",
                    message: (
                        <div>
                            <Text mb="sm">Success: {s} | Failed: {f}</Text>
                            <Button onClick={() => location.reload()}>Refresh</Button>
                        </div>
                    ),
                    loading: false,
                    autoClose: 4000,
                    withCloseButton: true
                });
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
        title: `Editing Task`,
        centered: true,
        size: "fit-content",
        children: <TaskEditModal task={t} members={members} />
    });

    const registerTask = async (t: Task) => {
        let b = { task: t.id };

        setIsLoading(true);
        let s = (await fetch("/api/school/task/register", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;
        setIsLoading(false);

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
                <Autocomplete style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} data={categories} />

                <div className={styles.wr}>
                    <Tooltip label="Add">
                        <ActionIcon variant="filled" mr="xs" onClick={addTask}><IconPlus /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Upload">
                        <ActionIcon variant="filled" mr="xs" onClick={uploadTasks}><IconUpload /></ActionIcon>
                    </Tooltip>

                    <CSVLink style={{ marginRight: 10 }} data={[["Category", "Location", "Description", "Starting Date", "Ending Date", "Starting Time", "Ending Time", "Capacity"], ...tasks.map(v => [v.category, v.location, v.description, v.starting_date, v.ending_date, v.starting_time, v.ending_time, v.capacity])]} filename={`${school.name} tasks (${new Date().getUTCFullYear()})`}>
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

                                        <Group mt="md">
                                            {assignments.find(x => x.email === user.email && x.task === v.id) ? (
                                                <Button disabled={!school.drop_enabled} onClick={() => dropTask(v)} color="red">Drop</Button>
                                            ) : (
                                                <Button loading={isLoading} disabled={assignments.filter(x => x.task === v.id).length >= v.capacity || assignments.filter(x => x.email === user.email).length >= school.max_assigned} onClick={() => registerTask(v)}>Register</Button>
                                            )}

                                            <Button onClick={() => openTaskModal(v)}>Manage</Button>
                                        </Group>
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