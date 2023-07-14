import { Task } from "@/lib/schema";
import { Tooltip } from "@mantine/core";
import { IconCalendarTime, IconHistory, IconProgress } from "@tabler/icons-react";
import dayjs from 'dayjs';

export default function DynamicIcon({ v }: { v: Task }) {
    let r = compareTime(v);

    if (r === "planned") return <Tooltip label="Planned"><IconCalendarTime color="blue" /></Tooltip>;
    if (r === "ongoing") return <Tooltip label="On Going"><IconProgress color="green" /></Tooltip>;
    if (r === "completed") return <Tooltip label="Completed"><IconHistory color="red" /></Tooltip>;
}

export function compareTime(task: Task): string {
    let today = dayjs();
    let start = dayjs(task.starting_date + " " + task.starting_time);
    let end = dayjs(task.ending_date + " " + task.ending_time);

    if (today < start) return "planned";
    if (start <= today && today <= end) return "ongoing";
    if (end < today) return "completed";
}