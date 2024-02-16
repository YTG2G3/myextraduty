'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import moment from 'moment-timezone';

const timezones = moment.tz.names();

export function TimezoneSelector({ initialValue, setTimezone }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild style={{ width: '100%' }}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value || 'Select Timezone...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 h-[300px]" align="start">
        <Command>
          <CommandInput placeholder="Search timezone..." />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandGroup className="overflow-scroll overflow-x-hidden">
            {timezones.map((timezone) => (
              <CommandItem
                key={timezone}
                value={timezone}
                onSelect={() => {
                  setValue(timezone);
                  setTimezone(timezone);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === timezone ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {timezone}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
