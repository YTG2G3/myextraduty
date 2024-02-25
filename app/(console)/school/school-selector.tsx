'use client';

import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SchoolSelectorProps {
  id: string;
  name: string;
  image: string;
}

export default function SchoolSelector({
  data
}: {
  data: SchoolSelectorProps[];
}) {
  return (
    <div className="flex flex-col justify-around items-center h-screen">
      <div className="font-grotesque text-3xl font-semibold">
        Select school to continue
      </div>
      {data.length > 0 ? (
        <div className="flex gap-6">
          {data.map((school) => (
            <div
              key={school.id}
              className={'flex flex-col items-center justify-center gap-2'}
            >
              <Link
                href={`/school/${school.id}/dashboard`}
                className="rounded-lg p-4 shadow-sm hover:shadow-lg cursor-pointer duration-300"
              >
                <Image
                  src={school.image}
                  alt={`${school.name} logo`}
                  width={150}
                  height={150}
                />
              </Link>
              <span className="text-muted-foreground">{school.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">
          No school is available. Create a new school or check for invitations.
        </div>
      )}
      <Link href="/boarding" className={navigationMenuTriggerStyle()}>
        <span className="flex gap-2 items-center text-muted-background text-sm">
          <Plus className="w-4 h-4" />
          Create a new school
        </span>
      </Link>
    </div>
  );
}
