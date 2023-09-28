import { Task } from "@/lib/schema";
import { Text } from "@mantine/core";
import dayjs from 'dayjs';

// TODO - go to task page
export default function TaskViewModal({ task }: { task: Task }) {
    return (
        <div>
            <Text>Location: {task.location}</Text>
            <Text>Description: {task.description}</Text>
            <Text>Date(s): {dayjs(task.starting_date).format("ddd, MMMM D, YYYY")} {task.starting_date !== task.ending_date ? `~ ${dayjs(task.ending_date).format("ddd, MMMM D, YYYY")}` : ""}</Text>
            <Text>Time: {dayjs(task.starting_time, "HH:mm").format("h:mm A")} - {dayjs(task.ending_time, "HH:mm").format("h:mm A")}</Text>
            <Text>Capacity: {task.capacity}</Text>
        </div>
    );
}