import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function handler(req: any, res: any) {
    res.json({
        server: dayjs(),
        serverInTZ: dayjs().tz('America/Los_Angeles'),
        serverInKorea: dayjs().tz('Asia/Seoul'),
        serverStr: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        serverStrInTZ: dayjs().tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss'),
        serverStrInKorea: dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
    });
}