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

  const randomTask: Task[] = [
    {
      id: 'asdf',
      schoolId: 'sadf',
      category: 'asdf',
      title: 'title',
      description:
        'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf',
      startingDate: new Date(),
      endingDate: new Date(),
      startingTime: new Date(),
      endingTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'asdf',
      schoolId: 'sadf',
      category: 'asdf',
      title: 'title',
      description: 'asdf',
      startingDate: new Date(),
      endingDate: new Date(),
      startingTime: new Date(),
      endingTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'asdf',
      schoolId: 'sadf',
      category: 'asdf',
      title: 'title',
      description: 'asdf',
      startingDate: new Date(),
      endingDate: new Date(),
      startingTime: new Date(),
      endingTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'asdf',
      schoolId: 'sadf',
      category: 'asdf',
      title: 'title',
      description: 'asdf',
      startingDate: new Date(),

      endingDate: new Date(),
      startingTime: new Date(),
      endingTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'asdf',
      schoolId: 'sadf',
      category: 'asdf',
      title: 'title',
      description: 'asdf',
      startingDate: new Date(),

      endingDate: new Date(),
      startingTime: new Date(),
      endingTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return (
    <div>
      <div className="w-full">
        <div className="flex flex-row gap-4 flex-wrap">
          {randomTask.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="break-all float-left grid-item w-72 h-48 overflow-hidden">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>Category: {task.category}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden max-h-36">
        <p>{task.description}</p>
      </CardContent>
      <CardFooter>migi</CardFooter>
    </Card>
  );
}
