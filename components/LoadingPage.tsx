import { Button, Center, Loader, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LoadingPage() {
    let [r, setR] = useState(false);
    let router = useRouter();

    useEffect(() => {
        setTimeout(() => setR(true), 3000);
    }, []);

    return (
        <Center style={{ height: "100vh" }}>
            <Stack align="center">
                <Loader variant="bars" />

                {r ? <Button onClick={() => router.reload()}>Refresh</Button> : undefined}
            </Stack>
        </Center>
    );
}