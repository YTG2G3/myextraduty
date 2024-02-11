import { format } from 'date-fns';

// Intuitively format date
export default function formatInt(date: Date) {
  return format(date, 'EEE, MMMM d, Y');
}
