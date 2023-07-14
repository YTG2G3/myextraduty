import { Task } from "@/lib/schema";
import { Tooltip } from "@mantine/core";
import { IconCalendarTime, IconHistory, IconProgress } from "@tabler/icons-react";
import dayjs from 'dayjs';

export default function DynamicIcon({ v }: { v: Task }) {
    let today = dayjs();
    let start = dayjs(v.starting_date + " " + v.starting_time);
    let end = dayjs(v.ending_date + " " + v.ending_time);

    if (today < start) return <Tooltip label="Planned"><IconCalendarTime color="blue" /></Tooltip>;
    if (start <= today && today <= end) return <Tooltip label="On Going"><IconProgress color="green" /></Tooltip>;
    if (end < today) return <Tooltip label="Past"><IconHistory color="red" /></Tooltip>;
}