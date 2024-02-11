import { format } from 'date-fns';
import getOffset from './get-offset';

export default function buildISOString(
  date: Date,
  time: string,
  timezone: string
) {
  let tz = getOffset(timezone);
  return (
    format(date, 'yyyy-MM-dd') +
    'T' +
    time +
    ':00' +
    (tz >= 0 ? '+' : '-') +
    pad(Math.floor(Math.abs(tz) / 60)) +
    ':' +
    pad(Math.abs(tz) % 60)
  );
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}
