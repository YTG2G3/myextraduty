'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useContext, useEffect } from 'react';
import { FormContext } from '../form-ref-provider';
import { navigate } from '@/lib/navigate';

// TODO - this page is for selecting a stripe plan and registering credit card. when developing the stripe part, remove the placeholder
// Collecte plan, billing address, etc needed to create a stripe customerId and save it in 'plan' session storage

// PLACEHOLDER
const formSchema = z.object({
    code: z.string().min(1),
});

export default function Plan() {
    let ref = useContext(FormContext);

    let form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: ""
        }
    });

    useEffect(() => {
        let basic = sessionStorage.getItem("basic");
        if (!basic) navigate("/school/new/basic");

        let s = sessionStorage.getItem("plan");

        if (s) {
            let ss: z.infer<typeof formSchema> = JSON.parse(s);

            form.setValue("code", ss.code);
        }
    }, [form]);

    function onSubmit(values: z.infer<typeof formSchema>, e: React.BaseSyntheticEvent) {
        e.preventDefault();

        sessionStorage.setItem("plan", JSON.stringify(values));
        navigate("/school/new/advanced");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" ref={ref}>
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Promotion Code</FormLabel>

                            <FormControl>
                                <Input placeholder="XXXXXX..." {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}