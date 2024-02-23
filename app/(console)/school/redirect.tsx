'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Eclipse } from 'react-svg-spinners';

export default function Redirect({
  id,
  check
}: {
  id: string;
  check: (school_id: string) => Promise<boolean>;
}) {
  let router = useRouter();

  useEffect(() => {
    // Load school id from local storage
    let school = localStorage.getItem('school');

    // If not set, redirect to id
    if (!school) {
      localStorage.setItem('school', id);
      router.push(`/school/${id}/dashboard`);
    }

    // Check if user is enrolled in school
    check(school).then((enrolled) => {
      if (!enrolled) {
        localStorage.removeItem('school');
        router.push(`/school/${id}/dashboard`);
      } else {
        router.push(`/school/${school}/dashboard`);
      }
    });
  }, [id, router, check]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Eclipse className="h-16 w-16" />
    </div>
  );
}
