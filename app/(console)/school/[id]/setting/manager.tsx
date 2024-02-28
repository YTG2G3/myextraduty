'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import DateTimePicker from '@/components/ui/date-time-picker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TimezoneSelector } from '@/components/ui/timezone-selector';
import { School } from '@/prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ImageUploader from './image-uploader';

const formSchema = z.object({
  timezone: z.string().min(1),
  name: z.string().min(1),
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
    const loadingtoast = toast.loading('Updating information...');

    let res = await updateSchool(values);

    if (res) {
      router.refresh();
      toast.success('School updated.', { id: loadingtoast });
    } else toast.error('Failed to update school.', { id: loadingtoast });
  }

  return (
    <div
      className="w-full h-full grid gap-2 py-4"
      style={{ gridTemplateColumns: 'auto auto' }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border-r-2 border-gray-200 pr-8"
        >
          <h1 className="text-2xl font-semibold font-grotesque">
            Manage Basic Information
          </h1>
          <FormField
            control={form.control}
            name="name"
            disabled={form.formState.isSubmitting}
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
            name="timezone"
            disabled={form.formState.isSubmitting}
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
            disabled={form.formState.isSubmitting}
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
                    <span className="text-black">
                      Displayed in {school.timezone}
                    </span>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone !==
                    school.timezone ? (
                      <div>
                        (local:{' '}
                        {Intl.DateTimeFormat().resolvedOptions().timeZone})
                      </div>
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
            disabled={form.formState.isSubmitting}
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
            disabled={form.formState.isSubmitting}
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
                    disabled={form.formState.isSubmitting}
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

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </form>
      </Form>
      <div className="px-2">
        <ImageUploader image={school.image} school_id={school.id} />
      </div>
    </div>
  );
}
