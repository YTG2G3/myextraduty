'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Eclipse } from 'react-svg-spinners';

export default function NewInit() {
  const router = useRouter();

  useEffect(() => {
    let basic = sessionStorage.getItem('basic');
    if (!basic) {
      router.push('/school/new/basic');
      return;
    }

    let plan = sessionStorage.getItem('plan');
    if (!plan) {
      router.push('/school/new/plan');
      return;
    }

    let advanced = sessionStorage.getItem('advanced');
    if (!advanced) {
      router.push('/school/new/advanced');
      return;
    }

    router.push('/school/new/complete');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Eclipse className="h-16 w-16" />
    </div>
  );
}
