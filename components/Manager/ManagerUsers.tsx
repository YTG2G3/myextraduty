import { Accordion, ActionIcon, Group, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import styles from '@/styles/ManagerUsers.module.scss';
import { useContext, useState } from "react";
import { Member } from "@/lib/schema";
import Image from "next/image";
import SiteContext from "@/lib/site-context";

// TODO - manage users
export default function ManagerUsers({ members }: { members: Member[] }) {
    let [search, setSearch] = useState("");
    let { school } = useContext(SiteContext);

    const searchForMember = (v: Member) => (
        v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        v.email.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );

    let m: Member[] = members.filter(searchForMember);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str);
    }

    return (
        <div className={styles.container}>
            <div className={styles.gro} >
                <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />

                <Group>
                    <Tooltip label="Add">
                        <ActionIcon></ActionIcon>
                    </Tooltip>
                </Group>
            </div>

            <Accordion style={{ width: "100%", marginTop: 20 }}>
                {m.map((v, i) => (
                    <Accordion.Item key={i} value={v.email}>
                        <Accordion.Control><Text color={v.manager ? "#339AF0" : undefined}>{v.name} {v.email === school.owner ? "(Owner)" : v.manager ? "(Manager)" : undefined}</Text></Accordion.Control>

                        <Accordion.Panel>
                            <Group>
                                <Image src={v.picture} width={100} height={100} alt={v.name} />

                                <Stack ml="lg">
                                    <Text>Email: {v.email}</Text>


                                </Stack>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}