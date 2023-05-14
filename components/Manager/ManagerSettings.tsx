import SiteContext from '@/lib/site-context';
import styles from '@/styles/ManagerSettings.module.scss';
import { Button, Group, MANTINE_COLORS, Select, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
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

    // TODO - opening at and quota etc
    return (
        <form className={styles.container} onSubmit={saveChanges}>
            <TextInput name="address" label="Address" defaultValue={school.address} />
            <TextInput name="logo" label="Logo URL" defaultValue={school.logo} />
            <Select name="primary_color" withAsterisk label="School Color" data={MANTINE_COLORS.map((v) => ({ value: v, label: v }))} defaultValue="blue" />

            <div className={styles.ho}>
                <Button loading={loading} m="lg" color="red" onClick={transferOwner}>Transfer Ownership</Button>
                <Button loading={loading} m="lg" type="submit">Save</Button>
            </div>
        </form>
    );
}