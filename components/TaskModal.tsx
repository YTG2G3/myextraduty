import { Task } from "@/lib/schema";
import { Text, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";

export default function TaskModal({ task }: { task: Task }) {
    // TODO - embed edit box

    return (
        <div>
            <Text>Name: {task.name}</Text>
            <Text>Description: {task.description}</Text>
            <Text>Category: {task.category}</Text>
        </div>
    );
}

// TODO - edit / save button
function EditBox({ ml, ph, value, setValue }: { ml: boolean, ph: string, value: string, setValue: Function }) {
    let [editing, setEditing] = useState(false);

    if (!editing) return (
        <Text>{value}</Text>
    );

    if (ml) return (
        <Textarea placeholder={ph} value={value} onChange={(e) => setValue(e.target.value)} />
    );

    return (
        <TextInput placeholder={ph} value={value} onChange={(e) => setValue(e.target.value)} />
    );
}