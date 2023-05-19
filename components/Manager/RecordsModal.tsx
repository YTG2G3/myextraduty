import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

export default function RecordsModal({ school, email }: { school: number, email: string }) {
    let [rec, setRec] = useState(undefined);

    const loadRecords = async () => {
        // TODO - modify so that email is converted into url friendly text
        let s = await (await fetch(`/api/school/member/assigned?email=${email}`, { method: "GET", headers: { school: String(school) } })).json();
    }

    useEffect(() => { loadRecords() }, []);

    if (rec === undefined) return <Center style={{ height: "300px" }}><Loader /></Center>

    return (
        <div></div>
    );
}