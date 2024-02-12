'use client';

import { bricolage } from '@/app/fonts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navigate } from '@/lib/navigate';
import { format } from 'date-fns';
import { BellElectric } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Complete() {
  let [basic, setBasic] = useState(undefined);
  let [advanced, setAdvanced] = useState(undefined);
  let [plan, setPlan] = useState(undefined);

  useEffect(() => {
    let basic = sessionStorage.getItem('basic');
    let advanced = sessionStorage.getItem('advanced');
    let plan = sessionStorage.getItem('plan');

    if (!basic || !advanced || !plan) navigate('/school/new/basic');

    setBasic(JSON.parse(basic));
    setAdvanced(JSON.parse(advanced));
    setPlan(JSON.parse(plan));
  }, []);

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
            Opening At: <u>{format(advanced.openingAt, 'PPP hh:mm a')}</u>
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
