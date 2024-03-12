'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task } from '@/prisma/client';
import { useState } from 'react';

// TODO - manage tasks
export default function Manager({
  session,
  school,
  tasks,
  invitations,
  enrollments
}: {
  session: AuthSession;
  school: School[];
  tasks: Task[];
  invitations: Invitation[];
  enrollments: Enrollment[];
}) {
  let [search, setSearch] = useState('');

  return <div>{/* <SearchBar search={search} setSearch={setSearch} /> */}</div>;
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>Category: {task.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
