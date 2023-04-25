import SiteContext from '@/lib/site-context';
import styles from '@/styles/ManagerSettings.module.scss';
import { Button, MANTINE_COLORS, Select, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useContext, useState } from 'react';

// TODO - manage settings
export default function ManagerSettings() {
    let { school, user } = useContext(SiteContext);
    let [loading, setLoading] = useState(false);

    const saveChanges = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        let b = {
            owner: user.email,
            address: e.target.address.value,
            primary_color: e.target.primary_color.value,
            logo: e.target.logo.value
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

    // TODO - opening at and quota etc
    return (
        <form className={styles.container} onSubmit={saveChanges}>
            <TextInput name="address" label="Address" defaultValue={school.address} />
            <TextInput name="logo" label="Logo URL" defaultValue={school.logo} />
            <Select name="primary_color" withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} defaultValue="blue" />

            <div className={styles.ho}>
                <Button loading={loading} m="lg" color="red">Transfer Ownership</Button>
                <Button loading={loading} m="lg" type="submit">Save</Button>
            </div>
        </form>
    );
}