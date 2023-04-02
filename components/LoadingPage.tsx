import { Center, Loader } from "@mantine/core";

export default function LoadingPage() {
    return (
        <Center style={{ height: "100vh" }}>
            <Loader variant="bars" />
        </Center>
    );
}