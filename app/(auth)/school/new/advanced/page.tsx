'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useContext, useEffect, useState } from 'react';
import { FormContext } from '../form-ref-provider';
import { navigate } from '@/lib/navigate';
import { Checkbox } from '@/components/ui/checkbox';
import DateTimePicker from '@/components/ui/date-time-picker';

const formSchema = z.object({
    openingAt: z.string().datetime(),
    quota: z.number().int().nonnegative(),
    maxAssigned: z.number().int().positive(),
    dropEnabled: z.boolean(),
});

// TODO - image should be linked with bucket later on
export default function Advanced() {
    let ref = useContext(FormContext);
    let [timezone, setTimezone] = useState(null);

    let form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            openingAt: null,
            quota: 4,
            maxAssigned: 10,
            dropEnabled: false
        }
    }); // TODO - possibly an option to set maxAssigned or quota as -1 (no condition)

    useEffect(() => {
        let plan = sessionStorage.getItem("plan");
        if (!plan) navigate("/school/new/plan");

        let basic = sessionStorage.getItem("basic");
        if (!basic) navigate("/school/new/basic");

        setTimezone(JSON.parse(basic).timezone);

        let s = sessionStorage.getItem("advanced");

        if (s) {
            let ss: z.infer<typeof formSchema> = JSON.parse(s);

            // TODO - bug fix. openingAt keep resetting instead of using saved because this code is rendered after <DateTimePicker />
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

    if (!timezone) return <></>

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" ref={ref}>
                <FormField
                    control={form.control}
                    name="openingAt"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Opening At</FormLabel>

                            <DateTimePicker timezone={timezone} value={field.value} setValue={(d: string) => form.setValue("openingAt", d)} />

                            <FormDescription>
                                Timezone is set to {timezone}
                            </FormDescription>

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
                                <Checkbox checked={field.value} onCheckedChange={(c: boolean) => form.setValue("dropEnabled", c)} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
