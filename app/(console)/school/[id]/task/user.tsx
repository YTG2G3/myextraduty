'use client';

import AuthSession from '@/lib/auth-session';
import { School, Task } from '@/prisma/client';
import { useState } from 'react';

export default function User({
  session,
  school,
  tasks
}: {
  session: AuthSession;
  school: School[];
  tasks: Task[];
}) {
  let [search, setSearch] = useState('');

  return <div></div>;
}
