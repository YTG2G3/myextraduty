import { Accordion, ActionIcon, Button, Group, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import styles from '@/styles/ManagerUsers.module.scss';
import { useContext, useState } from "react";
import { Member } from "@/lib/schema";
import Image from "next/image";
import SiteContext from "@/lib/site-context";
import { IconArchive, IconArrowBigUp, IconPlus, IconUpload, IconUserX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

// TODO - manage users
export default function ManagerUsers({ members }: { members: Member[] }) {
    let [search, setSearch] = useState("");
    let { school, user } = useContext(SiteContext);

    const searchForMember = (v: Member) => (
        v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        v.email.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );

    let m: Member[] = members.filter(searchForMember);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str);
    }

    const inviteMemberReq = async (e: any) => {
        e.preventDefault();

        let b = { email: e.target.email.value };
        let s = (await fetch("/api/school/member", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        if (s === 200) {
            modals.closeAll();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to edit school", message: "Please confirm that the owner's MyExtraDuty account has been created.", color: "red" });
    }

    const inviteMember = () => modals.open({
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
    })

    return (
        <div className={styles.container}>
            <div className={styles.gro} >
                <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />

                <div className={styles.wr}>
                    <Tooltip label="Invite">
                        <ActionIcon variant="filled" mr="xs" onClick={inviteMember}><IconPlus /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Upload">
                        <ActionIcon variant="filled"><IconUpload /></ActionIcon>
                    </Tooltip>
                </div>
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

                                    <Group className={styles.g}>
                                        {v.email !== user.email ? user.email === school.owner ? ( // Me owner
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon><IconArchive /></ActionIcon>
                                                </Tooltip>

                                                <Tooltip label="Promote">
                                                    <ActionIcon><IconArrowBigUp /></ActionIcon>
                                                </Tooltip>

                                                <Tooltip label="Remove">
                                                    <ActionIcon><IconUserX color="red" /></ActionIcon>
                                                </Tooltip>
                                            </>
                                        ) : !v.manager ? ( // Me manager, you user
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon><IconArchive /></ActionIcon>
                                                </Tooltip>

                                                <Tooltip label="Remove">
                                                    <ActionIcon><IconUserX color="red" /></ActionIcon>
                                                </Tooltip>
                                            </>
                                        ) : ( // Me manager, you manager
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon><IconArchive /></ActionIcon>
                                                </Tooltip>
                                            </>
                                        ) : ( // You me
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon><IconArchive /></ActionIcon>
                                                </Tooltip>
                                            </>
                                        )}
                                    </Group>
                                </Stack>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}