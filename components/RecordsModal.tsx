import { Task } from "@/lib/schema";
import SiteContext from "@/lib/site-context";
import { Accordion, Center, Loader, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

export default function RecordsModal({ sid, email }: { sid: number, email: string }) {
    let [tasks, setTasks] = useState<Task[]>(undefined);
    let { school } = useContext(SiteContext);

    const loadRecords = async () => {
        let s = await (await fetch(`/api/school/member/assigned?${new URLSearchParams({ email })}`, { method: "GET", headers: { school: String(sid) } })).json();
        setTasks(s);
    }

    useEffect(() => { loadRecords() }, []);

    if (tasks === undefined) return <Center style={{ height: "300px" }}><Loader /></Center>

    return (
        <div>
            <Accordion>
                {tasks.map((t, i) => (
                    <Accordion.Item key={i} value={String(t.id)}>
                        <Accordion.Control>
                            <Text>{t.name}</Text>
                        </Accordion.Control>

                        <Accordion.Panel>
                            <Text></Text>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}