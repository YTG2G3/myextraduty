import AuthSession from "@/lib/auth-session";
import { School, Task } from "@prisma/client";

// TODO - tasks
export default function User({ session, school, tasks }: { session: AuthSession, school: School[], tasks: Task[] }) {
    return (
        <div>
            <h1>Task</h1>
        </div>
    );
}