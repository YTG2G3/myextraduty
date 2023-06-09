import { Accordion, ActionIcon, Button, Group, Stack, Text, TextInput, Tooltip, rem, useMantineTheme } from "@mantine/core";
import styles from '@/styles/ManagerUsers.module.scss';
import { useContext, useState } from "react";
import { Member } from "@/lib/schema";
import Image from "next/image";
import SiteContext from "@/lib/site-context";
import { IconArchive, IconArrowBigUp, IconArrowsTransferUp, IconDownload, IconFile, IconPlus, IconUpload, IconUser, IconUserX, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import Papa from 'papaparse';
import RecordsModal from "../RecordsModal";
import { CSVDownload, CSVLink } from 'react-csv';

// TODO - manage users
export default function ManagerUsers({ members }: { members: Member[] }) {
    let [search, setSearch] = useState("");
    let { school, user } = useContext(SiteContext);
    const theme = useMantineTheme();

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
    });

    const uploadInvitationsReq = async (files: FileWithPath[]) => {
        let file = files[0];

        Papa.parse(file, {
            complete: async ({ data: emails }) => {
                let e = emails as String[][];
                let b = { emails: e.filter((v) => v[0].trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)).map(v => v[0]) };
                let s = await (await fetch("/api/school/member/multi", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).json();

                modals.closeAll();
                notifications.show({ title: `Invited ${s.success}/${s.requested}`, message: "Please refresh after about 10 seconds for the system to update." });
            }
        });
    }

    const uploadInvitations = () => modals.open({
        title: `Upload Invitations`,
        centered: true,
        children: (
            <Dropzone onDrop={uploadInvitationsReq} accept={["text/csv"]} multiple={false}>
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
        )
    });

    const openRecords = (email: string) => modals.open({
        title: `Records of ${email}`,
        centered: true,
        children: <RecordsModal sid={school.id} email={email} />
    });

    const removeUser = (m: Member) => modals.openConfirmModal({
        title: `Are you sure about removing ${m.name === "" ? m.email : m.name}?`,
        children: <Text size="sm">{m.name === "" ? m.email : m.name} will immediately lose access to {school.name}.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
            let b = { email: m.email };
            let x = (await fetch("/api/school/member/remove", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

            if (x === 200) notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
            else notifications.show({ title: "Failed to remove member", message: "Please contact the developer to fix this error.", color: "red" });
        }
    });

    const promoteUser = (m: Member) => modals.openConfirmModal({
        title: `Are you sure about promoting ${m.name === "" ? m.email : m.name}?`,
        children: <Text size="sm">Managers have partial access to {school.name}&#39;s moderation menu.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        onConfirm: async () => {
            let b = { email: m.email };
            let x = (await fetch("/api/school/member/promote", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

            if (x === 200) notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
            else notifications.show({ title: "Failed to promote member", message: "Please contact the developer to fix this error.", color: "red" });
        }
    });

    const transferOwnership = (m: Member) => modals.openConfirmModal({
        title: `Are you sure about transferring ownership to ${m.name}?`,
        children: <Text size="sm">You will immediately be demoted to manager role and {m.name} will become the new owner of {school.name}. This action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        onConfirm: async () => {
            let b = { email: m.email };
            let x = (await fetch("/api/school/transfer", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

            if (x === 200) notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
            else notifications.show({ title: "Failed to transfer ownership", message: "Please contact the developer to fix this error.", color: "red" });
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.gro} >
                <TextInput style={{ width: "100%" }} placeholder="Search" value={search} onChange={onSearch} />

                <div className={styles.wr}>
                    <Tooltip label="Invite">
                        <ActionIcon variant="filled" mr="xs" onClick={inviteMember}><IconPlus /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Upload">
                        <ActionIcon variant="filled" mr="xs" onClick={uploadInvitations}><IconUpload /></ActionIcon>
                    </Tooltip>

                    <Tooltip label="Download">
                        <CSVLink data={members.map(v => [v.email])} filename={`${school.name} members (${new Date().getUTCFullYear()})`}>
                            <ActionIcon variant="filled"><IconDownload /></ActionIcon>
                        </CSVLink>
                    </Tooltip>
                </div>
            </div>

            <Accordion style={{ width: "100%", marginTop: 20 }}>
                {m.map((v, i) => (
                    <Accordion.Item key={i} value={v.email}>
                        <Accordion.Control>
                            <Text color={v.manager ? "#339AF0" : undefined}>{v.name === "" ? v.email : v.name} {v.email === school.owner ? "(Owner)" : v.manager ? "(Manager)" : undefined}</Text>
                        </Accordion.Control>

                        <Accordion.Panel>
                            <Group>
                                {v.picture === "" ? (
                                    <IconUser width={100} height={100} />
                                ) : (
                                    <Image src={v.picture} width={100} height={100} alt={v.name} />
                                )}

                                <Stack ml="lg">
                                    <Text>Email: {v.email}</Text>

                                    <Group className={styles.g}>
                                        {v.email !== user.email ? user.email === school.owner ? ( // Me owner
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon onClick={() => openRecords(v.email)}><IconArchive /></ActionIcon>
                                                </Tooltip>

                                                {!v.manager && v.name !== "" ? (
                                                    <Tooltip label="Promote">
                                                        <ActionIcon onClick={() => promoteUser(v)}><IconArrowBigUp /></ActionIcon>
                                                    </Tooltip>
                                                ) : undefined}

                                                {v.name !== "" ? (
                                                    <Tooltip label="Transfer Ownership">
                                                        <ActionIcon onClick={() => transferOwnership(v)}><IconArrowsTransferUp /></ActionIcon>
                                                    </Tooltip>
                                                ) : undefined}

                                                <Tooltip label="Remove">
                                                    <ActionIcon onClick={() => removeUser(v)}><IconUserX color="red" /></ActionIcon>
                                                </Tooltip>
                                            </>
                                        ) : !v.manager ? ( // Me manager, you user
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon onClick={() => openRecords(v.email)}><IconArchive /></ActionIcon>
                                                </Tooltip>

                                                <Tooltip label="Remove">
                                                    <ActionIcon onClick={() => removeUser(v)}><IconUserX color="red" /></ActionIcon>
                                                </Tooltip>
                                            </>
                                        ) : ( // Me manager, you manager
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon onClick={() => openRecords(v.email)}><IconArchive /></ActionIcon>
                                                </Tooltip>
                                            </>
                                        ) : ( // You me
                                            <>
                                                <Tooltip label="Record">
                                                    <ActionIcon onClick={() => openRecords(v.email)}><IconArchive /></ActionIcon>
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