'use client';

import { Button } from '@/components/ui/button';
import boardingSteps from '@/lib/boarding-steps';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { FormContext } from './form-ref-provider';
import { toast } from 'sonner';

export default function Nav({
  complete: actionComplete
}: {
  complete: Function;
}) {
  let ref = useContext(FormContext);
  let [loading, setLoading] = useState(false);
  const router = useRouter();

  let pathname = usePathname();
  if (!pathname) return <></>;

  let path = pathname.substring(pathname.lastIndexOf('/') + 1);
  let index =
    path === 'new' ? -1 : boardingSteps.findIndex((s) => s.to === path);

  function previous() {
    let p = boardingSteps[index - 1];
    router.push(p.to);
  }

  function next() {
    ref.current.requestSubmit();
  }

  async function complete() {
    let basic = sessionStorage.getItem('basic');
    let advanced = sessionStorage.getItem('advanced');
    let plan = sessionStorage.getItem('plan');

    if (!basic || !plan || !advanced) return;

    setLoading(true);
    let res = await actionComplete({
      ...JSON.parse(basic),
      ...JSON.parse(plan),
      ...JSON.parse(advanced)
    });
    setLoading(false);

    if (res) {
      sessionStorage.removeItem('basic');
      sessionStorage.removeItem('advanced');
      sessionStorage.removeItem('plan');
      router.push(`/school/${res}/dashboard`);
    } else toast.error('Unknown error has occured while creating a school.');
  }

  if (index === -1) return <></>;

  if (index === 0)
    return (
      <nav className="flex justify-end mt-8">
        <NextBtn next={next} />
      </nav>
    );

  if (index < boardingSteps.length - 1)
    return (
      <nav className="flex justify-between mt-8">
        <PrevBtn previous={previous} />
        <NextBtn next={next} />
      </nav>
    );

  if (index === boardingSteps.length - 1)
    return (
      <nav className="flex justify-center mt-8">
        <CompBtn loading={loading} complete={complete} />
      </nav>
    );
}

function PrevBtn({ previous }: { previous: () => void }) {
  return (
    <Button variant="link" onClick={previous}>
      <ChevronLeft />
      Previous
    </Button>
  );
}

function NextBtn({ next }: { next: () => void }) {
  return (
    <Button variant="link" onClick={next}>
      Next
      <ChevronRight />
    </Button>
  );
}

function CompBtn({
  complete,
  loading
}: {
  complete: () => void;
  loading: boolean;
}) {
  return (
    <Button variant="default" disabled={loading} onClick={complete}>
      {loading ? (
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="mr-2" />
      )}
      Complete
    </Button>
  );
}
