import { Accordion, ActionIcon, Avatar, Button, Group, Stack, Text, TextInput, Tooltip, rem, useMantineTheme } from "@mantine/core";
import styles from '@/styles/ManagerUsers.module.scss';
import { useContext, useState } from "react";
import { Assignment, Member, User } from "@/lib/schema";
import SiteContext from "@/lib/site-context";
import { IconArrowBigUp, IconArrowsTransferUp, IconDownload, IconFile, IconHelpOctagon, IconPlus, IconShieldStar, IconTrash, IconTrophy, IconUpload, IconUser, IconUserCog, IconUserQuestion, IconUserX, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';
import { receivedResponse } from "@/lib/received-response";
import RecordsModal from "../RecordsModal";
import { notifications } from "@mantine/notifications";

export default function ManagerUsers({ members, assignments }: { members: Member[], assignments: Assignment[] }) {
    let [search, setSearch] = useState("");
    let [tg, setTg] = useState(true);
    let { school, user } = useContext(SiteContext);
    const theme = useMantineTheme();

    const searchForMember = (v: Member) => (
        (v.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
            v.email.toLowerCase().indexOf(search.toLowerCase()) >= 0) &&
        !(assignments.filter(x => x.user === v.email).length >= school.quota && !tg)
    );

    let m: Member[] = members.filter(searchForMember);

    const onSearch = (e: any) => {
        let str = e.currentTarget.value;
        setSearch(str.trim());
    }

    const inviteMemberReq = async (e: any) => {
        e.preventDefault();

        let b = { email: e.target.email.value };
        let s = (await fetch("/api/school/member", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
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
                modals.closeAll();
                let e = emails as String[][];

                notifications.show({
                    id: "uploading-inv",
                    title: "Uploading invitations... Please leave the page open.",
                    loading: true,
                    autoClose: false,
                    withCloseButton: false,
                    message: `Pending: ${e.length} | Success: 0 | Failed: 0`
                });

                let s = 0, f = 0;
                for (let i in e) {
                    try {
                        let v = { email: e[i][0] };
                        let x = (await fetch("/api/school/member", { method: "POST", body: JSON.stringify(v), headers: { school: String(school.id) } })).status;

                        if (x === 200) s++;
                        else throw null;
                    } catch (error) {
                        f++;
                    }

                    notifications.update({
                        id: "uploading-inv",
                        title: "Uploading invitations... Please leave the page open.",
                        loading: true,
                        autoClose: false,
                        withCloseButton: false,
                        message: `Pending: ${e.length - s - f} | Success: ${s} | Failed: ${f}`
                    });
                }

                notifications.update({
                    id: "uploading-inv",
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

    const removeUser = (m: Member) => modals.openConfirmModal({
        title: `Are you sure about removing ${m.name === "" ? m.email : m.name}?`,
        children: <Text size="sm">{m.name === "" ? m.email : m.name} will immediately lose access to {school.name}.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
            let b = { email: m.email };
            let x = (await fetch("/api/school/member/remove", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

            receivedResponse(x);
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

            receivedResponse(x);
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

            receivedResponse(x);
        }
    });

    const openTaskModal = (u: User) => modals.open({
        title: `Records of ${u.name}`,
        centered: true,
        children: <RecordsModal school={school} email={u.email} />
    });

    const clearMembers = () => modals.openConfirmModal({
        title: "Are you sure about clearing members?",
        children: <Text size="sm">This action is irreversible.</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        centered: true,
        color: "red",
        onConfirm: async () => {
            let x = (await fetch("/api/school/member/clear", { method: "POST", headers: { school: String(school.id) } })).status;
            receivedResponse(x);
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

                    <CSVLink style={{ marginRight: 10 }} data={members.map(v => [v.email])} filename={`${school.name} members (${new Date().getUTCFullYear()})`}>
                        <Tooltip label="Download">
                            <ActionIcon variant="filled"><IconDownload /></ActionIcon>
                        </Tooltip>
                    </CSVLink>

                    <Tooltip label="Toggle Quota Met">
                        <ActionIcon variant={tg ? "filled" : "outline"} onClick={() => setTg(!tg)}><IconTrophy /></ActionIcon>
                    </Tooltip>

                    {user.email === school.owner ? <Tooltip label="Clear All">
                        <ActionIcon ml="xs" color="red" variant="filled" onClick={clearMembers}><IconTrash /></ActionIcon>
                    </Tooltip> : undefined}
                </div>
            </div>

            <Accordion style={{ width: "100%", marginTop: 20 }}>
                {m.map((v, i) => (
                    <Accordion.Item key={i} value={v.email}>
                        <Accordion.Control icon={v.name === "" ? (
                            <Tooltip label="Account Missing">
                                <IconHelpOctagon color="gray" />
                            </Tooltip>
                        ) : v.email === school.owner ? (
                            <Tooltip label="Owner">
                                <IconShieldStar color="green" />
                            </Tooltip>
                        ) : v.manager ? (
                            <Tooltip label="Manager">
                                <IconUserCog color="blue" />
                            </Tooltip>
                        ) : <IconUser />}>
                            <Tooltip position="top-start" label={assignments.filter(x => x.user === v.email).length >= school.quota ? (
                                <Text>Met quota!</Text>
                            ) : (
                                <Text>{school.quota - assignments.filter(x => x.user === v.email).length} more to go!</Text>
                            )}>
                                <Group align='baseline'>
                                    <Text weight="bold">{v.name === "" ? "Unknown User" : v.name}</Text>
                                    <Text color="dimmed" size="sm">{v.email}</Text>
                                </Group>
                            </Tooltip>
                        </Accordion.Control>

                        <Accordion.Panel>
                            <Group>
                                <div className={styles.in}>
                                    {v.picture === "" ? (
                                        <Avatar mr="20px" variant="filled" size={80}><IconUserQuestion size={40} /></Avatar>
                                    ) : (
                                        <Avatar mr="20px" src={v.picture} size={80} alt={v.name} />
                                    )}

                                    {v.name !== "" ? (
                                        <div className={styles.ou}>
                                            {assignments.filter(x => x.user === v.email).length >= school.quota ? (
                                                <Text>This user has met quota!</Text>
                                            ) : (
                                                <Text>{school.quota - assignments.filter(x => x.user === v.email).length} more task(s) to take before meeting quota.</Text>
                                            )}

                                            <Button variant="light" onClick={() => openTaskModal(v)}>Details</Button>
                                        </div>
                                    ) : undefined}

                                    <Group className={styles.g}>
                                        {v.email !== user.email ? user.email === school.owner ? ( // Me owner
                                            <>
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
                                            <Tooltip label="Remove">
                                                <ActionIcon onClick={() => removeUser(v)}><IconUserX color="red" /></ActionIcon>
                                            </Tooltip>
                                        ) : ( // Me manager, you manager
                                            <Text color="dimmed" size="sm">No available options...</Text>
                                        ) : ( // You me
                                            <Text color="dimmed" size="sm">No available options...</Text>
                                        )}
                                    </Group>
                                </div>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}