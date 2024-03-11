'use client';

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
