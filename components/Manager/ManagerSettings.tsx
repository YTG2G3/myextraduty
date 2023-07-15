import SiteContext from '@/lib/site-context';
import styles from '@/styles/ManagerSettings.module.scss';
import { Button, Group, MANTINE_COLORS, NumberInput, Select, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useContext, useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { receivedResponse } from '@/lib/received-response';

export default function ManagerSettings() {
    let { school, user } = useContext(SiteContext);
    let [loading, setLoading] = useState(false);

    const saveChanges = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        let b = {
            address: e.target.address.value,
            primary_color: e.target.primary_color.value,
            logo: e.target.logo.value,
            opening_at: e.target.opening_at.value === "" ? null : e.target.opening_at.value,
            quota: e.target.quota.value,
            max_assigned: e.target.max_assigned.value
        }

        let s = (await fetch("/api/school/update", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
        setLoading(false);
    }

    const transferReq = async (e: any) => {
        e.preventDefault();

        let b = { email: e.target.owner.value };

        let s = (await fetch("/api/school/transfer", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        receivedResponse(s);
    }

    const transferOwner = () => modals.open({
        title: `Transfer ownership of ${school.name}`,
        centered: true,
        children: (
            <form onSubmit={(e) => transferReq(e)}>
                <TextInput name="owner" withAsterisk label="New Owner Email" />

                <Group position="right" mt="md">
                    <Button type="submit" color='red'>Transfer</Button>
                </Group>
            </form>
        )
    });

    return (
        <form className={styles.container} onSubmit={saveChanges}>
            <TextInput name="address" label="Address" defaultValue={school.address} />
            <Select name="primary_color" withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} defaultValue={school.primary_color} />
            <TextInput name="logo" label="Logo URL" defaultValue={school.logo} />
            <DateTimePicker valueFormat='MMM DD YYYY hh:mm A' name="opening_at" label="Opening At" defaultValue={school.opening_at === "" ? new Date(school.opening_at) : null} />
            <NumberInput name="quota" label="Quota" min={0} defaultValue={school.quota} />
            <NumberInput name="max_assigned" label="Max Assigned" min={1} defaultValue={school.max_assigned} />

            <div className={styles.ho}>
                <Button loading={loading} m="lg" color="red" onClick={transferOwner} disabled={school.owner !== user.email}>Transfer Ownership</Button>
                <Button loading={loading} m="lg" type="submit">Save</Button>
            </div>
        </form>
    );
}