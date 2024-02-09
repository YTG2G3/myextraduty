'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useContext, useEffect } from 'react';
import { FormContext } from '../form-ref-provider';
import { navigate } from '@/lib/navigate';

const formSchema = z.object({
    timezone: z.string().min(1),
    name: z.string().min(1),
    image: z.string().url()
});

// TODO - image should be linked with bucket later on
export default function Basic() {
    let ref = useContext(FormContext);

    let form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            name: "",
            image: ""
        }
    });

    useEffect(() => {
        let s = sessionStorage.getItem("basic");

        if (s) {
            let ss: z.infer<typeof formSchema> = JSON.parse(s);

            form.setValue("timezone", ss.timezone);
            form.setValue("name", ss.name);
            form.setValue("image", ss.image);
        }
    }, [form]);

    function onSubmit(values: z.infer<typeof formSchema>, e: React.BaseSyntheticEvent) {
        e.preventDefault();

        sessionStorage.setItem("basic", JSON.stringify(values));
        navigate("/school/new/plan");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" ref={ref}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>School Name</FormLabel>

                            <FormControl>
                                <Input placeholder="ex. Centennial High School" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logo URL</FormLabel>

                            <FormControl>
                                <Input placeholder="Public available link of image" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Timezone</FormLabel>

                            <FormControl>
                                <Input placeholder="America/Los_Angeles" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}