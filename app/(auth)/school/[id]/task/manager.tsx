import AuthSession from "@/lib/auth-session";
import { Enrollment, Invitation, School, Task } from "@prisma/client";

// TODO - manage tasks
export default function Manager({ session, school, tasks, invitations, enrollments }: { session: AuthSession, school: School[], tasks: Task[], invitations: Invitation[], enrollments: Enrollment[] }) {
    return (
        <div>
            <h1>Manage tasks</h1>
        </div>
    );
}