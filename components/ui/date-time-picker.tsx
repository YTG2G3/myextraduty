import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { FormControl } from './form';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { Input } from './input';
import { Separator } from './separator';
import moment from 'moment-timezone';

export default function DateTimePicker({
  timezone,
  value,
  setValue
}: {
  timezone: string;
  value: string;
  setValue: (d: string) => void;
}) {
  let [date, setDate] = useState(moment(value).tz(timezone).toDate());
  let [time, setTime] = useState(moment(value).tz(timezone).format('HH:mm'));

  useEffect(() => setValue(getISO(date, time)), [date, time, setValue, getISO]);

  // Extracts date part after converting local timezone into UTC
  function getDateString(d: Date) {
    let iso = moment(d).utc(true).toISOString();
    return iso.substring(0, iso.indexOf('T'));
  }

  // Get pure ISO string
  function getISO(d: Date, t: string) {
    let m = moment.tz(getDateString(d) + ' ' + t, timezone);
    return m.toISOString();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'pl-3 text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            {date ? (
              <div className="flex space-x-2">
                <p>
                  {moment(date).format('LL')}{' '}
                  {moment(time, 'HH:mm').format('hh:mm A')}
                </p>
                {Intl.DateTimeFormat().resolvedOptions().timeZone !==
                timezone ? (
                  <p className="text-muted-foreground">
                    ({moment(getISO(date, time)).format('LL hh:mm A')})
                  </p>
                ) : undefined}
              </div>
            ) : (
              <span>Pick a date and time</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          disabled={(d) =>
            d.getUTCFullYear() === date.getUTCFullYear() &&
            d.getUTCMonth() === date.getUTCMonth() &&
            d.getUTCDate() === date.getUTCDate()
          }
          selected={date}
          onSelect={setDate}
          initialFocus
        />

        <Separator className="h-0.5" />

        <Input
          type="time"
          className="bg-transparent border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          value={time}
          onChange={(e: any) => setTime(e.target.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
