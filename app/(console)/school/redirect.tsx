'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Redirect({ id }: { id: string }) {
  let router = useRouter();

  useEffect(() => {
    // Load school id from local storage
    let school = localStorage.getItem('school');

    // If not set, redirect to id
    if (!school) {
      localStorage.setItem('school', id);
      router.push(`/school/${id}/dashboard`);
    } else {
      router.push(`/school/${school}/dashboard`);
    }
  }, [id, router]);

  return <></>;
}
