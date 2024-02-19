'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BackButton(props: ButtonProps) {
  const router = useRouter();

  return (
    <Button {...props} onClick={() => router.back()}>
      Go back
    </Button>
  );
}
