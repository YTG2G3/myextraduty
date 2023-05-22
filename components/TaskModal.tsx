import { Task } from "@/lib/schema";
import { Text } from "@mantine/core";

export default function TaskModal({ task }: { task: Task }) {
    return (
        <div>
            <Text>Name: {task.name}</Text>
            <Text>Description</Text>
        </div>
    );
}

function EditBox({ }) {

}