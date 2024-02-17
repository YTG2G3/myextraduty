'use client';

import { bricolage } from '@/app/fonts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { BellElectric } from 'lucide-react';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

export default function Complete() {
  const router = useRouter();

  let [basic, setBasic] = useState(undefined);
  let [advanced, setAdvanced] = useState(undefined);
  let [plan, setPlan] = useState(undefined);

  useEffect(() => {
    let basic = sessionStorage.getItem('basic');
    let advanced = sessionStorage.getItem('advanced');
    let plan = sessionStorage.getItem('plan');

    if (!basic || !advanced || !plan) router.push('/school/new/basic');

    setBasic(JSON.parse(basic));
    setAdvanced(JSON.parse(advanced));
    setPlan(JSON.parse(plan));
  }, [router]);

  if (!basic || !advanced) return <></>;

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl flex space-x-2 items-center">
        <p>Review</p>
        <b className={`${bricolage.className}`}>{basic.name}</b>
        <p>before completion</p>
        <BellElectric className="w-8 h-8" />
      </div>

      <div className="flex space-x-8 items-center mt-8">
        <div className="flex flex-col leading-loose">
          <span>
            Timezone: <u>{basic.timezone}</u>
          </span>
          <span>
            Opening At: <u>{moment(advanced.openingAt).format('LLLL')}</u>
          </span>
          <span>
            Quota: <u>{advanced.quota}</u>
          </span>
          <span>
            Max Assigned: <u>{advanced.maxAssigned}</u>
          </span>
          <span>
            Drop Enabled: <u>{advanced.dropEnabled ? 'Yes' : 'No'}</u>
          </span>
          <span>
            Promotion Code: <u>{plan.code}</u>
          </span>
        </div>

        <Avatar className="w-36 h-36 border">
          <AvatarImage src={basic.image} />
          <AvatarFallback>
            <div className="text-center">Avatar not available</div>
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
