'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useContext, useEffect } from 'react';
import { FormContext } from '../form-ref-provider';
import { navigate } from '@/lib/navigate';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
    openingAt: z.string().datetime(),
    quota: z.number().int().nonnegative(),
    maxAssigned: z.number().int().positive(),
    dropEnabled: z.boolean(),
});

// TODO - image should be linked with bucket later on
export default function Advanced() {
    let ref = useContext(FormContext);

    let form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            openingAt: new Date().toISOString(),
            quota: 4,
            maxAssigned: 10,
            dropEnabled: false
        }
    });

    useEffect(() => {
        let plan = sessionStorage.getItem("plan");
        if (!plan) navigate("/school/new/plan");

        let s = sessionStorage.getItem("advanced");

        if (s) {
            let ss: z.infer<typeof formSchema> = JSON.parse(s);

            form.setValue("openingAt", ss.openingAt);
            form.setValue("quota", ss.quota);
            form.setValue("maxAssigned", ss.maxAssigned);
            form.setValue("dropEnabled", ss.dropEnabled);
        }
    }, [form]);

    function onSubmit(values: z.infer<typeof formSchema>, e: React.BaseSyntheticEvent) {
        e.preventDefault();

        sessionStorage.setItem("advanced", JSON.stringify(values));
        navigate("/school/new/complete");
    }

    // TODO - deal with timezone error
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" ref={ref}>
                <FormField
                    control={form.control}
                    name="openingAt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{field.value}</FormLabel>

                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-[280px] justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {<span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            initialFocus
                                            selected={new Date(field.value)}
                                            onSelect={(date) => form.setValue("openingAt", date.toISOString())}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="quota"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quota</FormLabel>

                            <FormControl>
                                <Input type='number' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="maxAssigned"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Assigned</FormLabel>

                            <FormControl>
                                <Input type='number' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dropEnabled"
                    render={({ field }) => (
                        <FormItem className='flex items-center'>
                            <FormLabel>Drop Enabled</FormLabel>

                            <FormControl className='!mt-0 ml-3'>
                                <Checkbox />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}