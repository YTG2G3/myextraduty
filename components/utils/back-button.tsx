'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';

export default function BackButton(props: ButtonProps) {
  const router = useRouter();

  return (
    <Button {...props} onClick={() => router.back()}>
      Go back
    </Button>
  );
}
