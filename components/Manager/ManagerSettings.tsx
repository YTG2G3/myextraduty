import SiteContext from '@/lib/site-context';
import styles from '@/styles/ManagerSettings.module.scss';
import { Button, Group, MANTINE_COLORS, NumberInput, Select, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useContext, useState } from 'react';
import { DateTimePicker } from '@mantine/dates';

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
            quota: e.target.quota.value
        }

        try {
            let s = (await fetch("/api/school/update", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

            if (s === 200) notifications.show({ title: "Success!", message: "Please refresh for the system to update." });
            else throw null;
        } catch (error) {
            notifications.show({ title: "Failed to edit school", message: "Please confirm so that all fields meet the requirements.", color: "red" });
        }

        setLoading(false);
    }

    const transferReq = async (e: any) => {
        e.preventDefault();

        let b = { email: e.target.owner.value };

        let s = (await fetch("/api/school/transfer", { method: "POST", body: JSON.stringify(b), headers: { school: String(school.id) } })).status;

        if (s === 200) {
            modals.closeAll();
            notifications.show({ title: "Success!", message: "Please refresh after about 10 seconds for the system to update." });
        }
        else notifications.show({ title: "Failed to trasfer ownership", message: "Please confirm that the owner's MyExtraDuty account has been created.", color: "red" });
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
            <Select name="primary_color" withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} defaultValue="blue" />
            <TextInput name="logo" label="Logo URL" defaultValue={school.logo} />
            <DateTimePicker valueFormat='MMM DD YYYY hh:mm A' name="opening_at" label="Opening At" defaultValue={school.opening_at === "" ? new Date(school.opening_at) : null} />
            <NumberInput name="quota" label="Quota" type='number' min={0} defaultValue={school.quota} />

            <div className={styles.ho}>
                <Button loading={loading} m="lg" color="red" onClick={transferOwner} disabled={school.owner !== user.email}>Transfer Ownership</Button>
                <Button loading={loading} m="lg" type="submit">Save</Button>
            </div>
        </form>
    );
}