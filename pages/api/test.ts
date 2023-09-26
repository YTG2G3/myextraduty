import dayjs from 'dayjs';

export default function handler(req: any, res: any) {
    res.json({
        server: dayjs.tz("2023-03-01 11:00:00", "America/Los_Angeles").format("YYYY-MM-DD HH:mm:ss"),
        tz: dayjs("2023-03-01 11:00:00").format("YYYY-MM-DD HH:mm:ss"),
        comp: dayjs("2023-03-01 11:00:00").diff(dayjs.tz("2023-03-01 11:00:00", "America/Los_Angeles"))
    });
}