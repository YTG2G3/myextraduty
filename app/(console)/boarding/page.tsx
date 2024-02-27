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
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  timezone: z.string().min(1),
  name: z.string().min(1),
  image: z.string().url(),
  openingAt: z.string().datetime(),
  quota: z.number().int().nonnegative(),
  maxAssigned: z.number().int().positive(),
  dropEnabled: z.boolean(),
  code: z.string().min(1)
});

export default function Boarding() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      name: '',
      image: '',
      openingAt: new Date().toISOString(),
      quota: undefined,
      maxAssigned: undefined,
      dropEnabled: false,
      code: ''
    }
  });
  let [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e: React.BaseSyntheticEvent
  ) {
    e.preventDefault();
  }

  return (
    <div className="overflow-y-scroll overflow-x-hidden w-screen h-screen snap-y snap-mandatory scroll-smooth">
      <Form {...form}>
        <div
          id="basic"
          className="w-screen h-screen flex flex-col items-start justify-center px-20 pb-40 snap-start"
        >
          <StepIndicator>Step 1 of 4</StepIndicator>
          <h1 className="font-grotesque font-semibold text-4xl my-2">
            Let&apos;s get your journey started
          </h1>
          <StepDirection>
            Fill in the basic information to get started.
          </StepDirection>
          <div className="w-[500px] mt-2 flex flex-col gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Centennial High School" {...field} />
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
          </div>
          <StepNavigator step={1} />
        </div>

        <div
          id="plan"
          className="w-screen h-screen flex flex-col items-start justify-center px-20 pb-40 snap-start"
        >
          <StepIndicator>Step 2 of 4</StepIndicator>
          <h1 className="font-grotesque font-semibold text-4xl my-2">
            Next...
          </h1>
          <StepDirection>Select the plan that suits your school.</StepDirection>
          <div className="w-[500px] mt-2 flex flex-col gap-3">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion code</FormLabel>

                  <FormControl>
                    <Input placeholder="huskies" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <StepNavigator step={2} />
        </div>

        <div
          id="advanced"
          className="w-screen h-screen flex flex-col items-start justify-center px-20 pb-40 snap-start"
        >
          <StepIndicator>Step 3 of 4</StepIndicator>
          <h1 className="font-grotesque font-semibold text-4xl my-2">
            Almost there...
          </h1>
          <StepDirection>
            Customize the settings just for your school.
          </StepDirection>
          <div className="w-[500px] mt-2 flex flex-col gap-3">
            <FormField
              control={form.control}
              name="openingAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Opening At</FormLabel>

                  <DateTimePicker
                    timezone={timezone}
                    value={field.value}
                    setValue={(d: string) => form.setValue('openingAt', d)}
                  />

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
                    <Input
                      type="number"
                      placeholder="Required count of tasks"
                      {...field}
                    />
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
                    <Input
                      type="number"
                      placeholder="Maximum task for a student"
                      {...field}
                    />
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
          </div>
          <StepNavigator step={3} />
        </div>

        <div
          id="review"
          className="w-screen h-screen flex flex-col items-start justify-center px-20 pb-40 snap-start"
        >
          <StepIndicator>Step 4 of 4</StepIndicator>
          <h1 className="font-grotesque font-semibold text-4xl my-2">
            Let&apos;s get your journey started
          </h1>
          <StepDirection>
            Fill in the basic information to get started.
          </StepDirection>
          <div className="w-[500px] mt-2 flex flex-col gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Centennial High School" {...field} />
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
                        setTimezone(value);
                        form.setValue('timezone', value);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <StepNavigator step={4} />
        </div>
      </Form>
    </div>
  );
}

function StepIndicator({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-grotesque font-light text-muted-foreground">
      {children}
    </span>
  );
}

function StepDirection({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-lg font-grotesque font-light text-muted-foreground">
      {children}
    </span>
  );
}

function StepNavigator({
  step,
  onComplete
}: {
  step: number;
  onComplete?: () => void;
}) {
  const steps = ['Basic', 'Plan', 'Advanced', 'Review', 'x'];

  return (
    <div className="flex justify-between items-center w-[500px] mt-6">
      <div>
        <Button variant="outline" className={step === 1 ? 'hidden' : ''}>
          <Link
            className={'flex gap-2 items-center'}
            href={`#${steps[step - 2 < 0 ? 0 : step - 2].toLowerCase()}`}
          >
            <ChevronLeft />
            Previous
          </Link>
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            if (step === 4) onComplete();
          }}
        >
          {step === 4 ? (
            <span
              className={
                'flex gap-2 items-center justify-end' +
                (step === 4 ? '' : 'hidden')
              }
            >
              <Check />
              Complete
            </span>
          ) : (
            <Link
              className={'flex gap-2 items-center justify-end'}
              href={`#${steps[step].toLowerCase()}`}
            >
              Next
              <ChevronRight />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
