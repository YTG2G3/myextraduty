import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export function receivedResponse(status: number) {
    if (status === 200) successNoti();
    else failNoti();
}

export function receivedRatioResponse(s: number, t: number) {
    notifications.show({
        title: `Success: ${s}/${t}`, message: (
            <div>
                <Text mb="sm">Please refresh the screen to apply changes.</Text>
                <Button onClick={() => location.reload()}>Refresh</Button>
            </div>
        )
    });
    modals.closeAll();
}

export function successNoti() {
    notifications.show({
        title: "Success!", message: (
            <div>
                <Text mb="sm">Please refresh the screen to apply changes.</Text>
                <Button onClick={() => location.reload()}>Refresh</Button>
            </div>
        )
    });
    modals.closeAll();
}

export function failNoti() {
    notifications.show({ title: "Unexpected Error", message: "Please contact the developer to fix this error.", color: "red" });
}