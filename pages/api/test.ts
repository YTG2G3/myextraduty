import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function handler(req: any, res: any) {
    res.json({
        server: dayjs(),
        serverInTZ: dayjs().tz('America/Los_Angeles'),
    });
}