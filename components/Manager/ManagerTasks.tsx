import { Task } from '@/lib/schema';
import SiteContext from '@/lib/site-context';
import styles from '@/styles/ManagerTasks.module.scss';
import { Accordion, ActionIcon, TextInput, Tooltip } from '@mantine/core';
import { IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { CSVLink } from 'react-csv';
import { modals } from "@mantine/modals";

export default function ManagerTasks({ tasks }: { tasks: Task[] }) {
    let [search, setSearch] = useState("");
    let { school } = useContext(SiteContext);

    const searchForTask = (v: Task) => (
        v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        v.category.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );

    let t: Task[] = tasks.filter(searchForTask);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str);
    }

    const addTaskReq = async (e: any) => {
        e.preventDefault();

        let b = { email: e.target.email.value };
        let s = (await fetch("/api/school/member", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        if (s === 200) {
            modals.closeAll();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to edit school", message: "Please confirm that the owner's MyExtraDuty account has been created.", color: "red" });
    }

    const addTask = () => modals.open({
        title: `Invite to ${school.name}`,
        centered: true,
        children: (
            <form onSubmit={inviteMemberReq}>
                <TextInput name="email" withAsterisk label="Email" />

                <Group position="right" mt="md">
                    <Button type="submit">Invite</Button>
                </Group>
            </form>
        )
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

                    <Tooltip label="Download">
                        <CSVLink data={[["Category", "Name", "Description", "Starting Date", "Ending Date", "Capacity"], ...tasks.map(v => [v.category, v.name, v.description, v.starting_date, v.ending_date, v.starting_time, v.ending_time, v.capacity])]} filename={`${school.name} members (${new Date().getUTCFullYear()})`}>
                            <ActionIcon variant="filled"><IconDownload /></ActionIcon>
                        </CSVLink>
                    </Tooltip>
                </div>
            </div>

            <Accordion style={{ width: "100%", marginTop: 20 }}>

            </Accordion>
        </div>
    );
}