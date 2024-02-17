'use client';

import { Input } from '@/components/ui/input';
import AuthSession from '@/lib/auth-session';
import { Enrollment, Invitation, School, Task } from '@prisma/client';
import HeaderWrapper from '../header-wrapper';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import DateTimePicker from '@/components/ui/date-time-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { TimezoneSelector } from '@/components/ui/timezone-selector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

const formSchema = z.object({
  timezone: z.string().min(1),
  name: z.string().min(1),
  image: z.string().url(),
  openingAt: z.string().datetime(),
  quota: z.number().int().nonnegative(),
  maxAssigned: z.number().int().positive(),
  dropEnabled: z.boolean()
});

// TODO - settings
export default function Manager({
  school,
  updateSchool
}: {
  school: School;
  updateSchool: Function;
}) {
  let router = useRouter();

  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timezone: school.timezone,
      name: school.name,
      image: school.image,
      openingAt: school.openingAt.toISOString(),
      quota: school.quota,
      maxAssigned: school.maxAssigned,
      dropEnabled: school.dropEnabled
    }
  });

  async function onSubmit(
    values: z.infer<typeof formSchema>,
    e: React.BaseSyntheticEvent
  ) {
    e.preventDefault();

    let res = await updateSchool(values);

    if (res) router.reload();
    else toast.error('Failed to update school.');
  }

  return (
    <HeaderWrapper title="Settings">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input
                    placeholder="Public available link of image"
                    {...field}
                  />
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
                  <TimezoneSelector
                    initialValue={field.value || ''}
                    setTimezone={(value) => {
                      form.setValue('timezone', value);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="openingAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Opening At</FormLabel>

                <DateTimePicker
                  timezone={school.timezone}
                  value={field.value}
                  setValue={(d: string) => form.setValue('openingAt', d)}
                />

                <FormDescription>
                  <div className="flex space-x-1">
                    <p>Displayed in {school.timezone}</p>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone !==
                    school.timezone ? (
                      <p>
                        (local:{' '}
                        {Intl.DateTimeFormat().resolvedOptions().timeZone})
                      </p>
                    ) : undefined}
                  </div>
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
                  <Input type="number" {...field} />
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
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dropEnabled"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel>Drop Enabled</FormLabel>

                <FormControl className="!mt-0 ml-3">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(c: boolean) =>
                      form.setValue('dropEnabled', c)
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save</Button>
        </form>
      </Form>
    </HeaderWrapper>
  );
}
