import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormControl } from "./form";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Separator } from "./separator";
import buildISOString from "@/lib/build-iso-string";

export default function DateTimePicker({ timezone, value, setValue }: {
    timezone: string, value: string, setValue: (d: string) => void
}) {
    let [date, setDate] = useState(new Date());
    let [time, setTime] = useState(format(new Date(), "HH:mm"));

    useEffect(() => setValue(parseISO(buildISOString(date, time, timezone)).toISOString()), [date, time, setValue, timezone]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "pl-3 text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        {date ? (
                            <p>{format(buildISOString(date, time, timezone), "PPP hh:mm a")}</p>
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
                    disabled={(d) => d.getUTCFullYear() === date.getUTCFullYear() && d.getUTCMonth() === date.getUTCMonth() && d.getUTCDate() === date.getUTCDate()}
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />

                <Separator className="h-0.5" />

                <Input type="time" className="bg-transparent border-0 focus-visible:ring-offset-0 focus-visible:ring-0" value={time} onChange={(e: any) => setTime(e.target.value)} />
            </PopoverContent>
        </Popover>
    );
}