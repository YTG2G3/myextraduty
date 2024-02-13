'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

  return <></>;
}
