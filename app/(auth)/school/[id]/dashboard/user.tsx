import AuthSession from "@/lib/auth-session";
import { School, Task } from "@prisma/client";

// TODO - show upcoming events (calendar view too) and alerts
export default function User({ session, school, tasks }: { session: AuthSession, school: School[], tasks: Task[] }) {
    return (
        <div>
            <h1>User</h1>
        </div>
    );
}