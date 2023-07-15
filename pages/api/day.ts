import dayjs from "dayjs";

export default function handler(req: any, res: any) {
    res.json(dayjs().toString());
}