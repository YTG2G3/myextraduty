'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useSubmitting } from '@/hooks/states';
import { createSchool } from '@/lib/actions/create-school';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  timezone: z.string().min(1),
  name: z.string().min(1),
  image: z.string(),
  openingAt: z.string().datetime(),
  quota: z.number().int().nonnegative(),
  maxAssigned: z.number().int().positive(),
  dropEnabled: z.boolean(),
  code: z.string().min(1)
});

export default function Boarding() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      name: '',
      image: '',
      openingAt: new Date().toISOString(),
      quota: 10,
      maxAssigned: 20,
      dropEnabled: false,
      code: ''
    }
  });

  let [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const submitting = useSubmitting((states) => states.submitting);
  const setSubmitting = useSubmitting((states) => states.setSubmitting);

  function getBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if (encoded.length % 4 > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  async function onSubmit(
    values: z.infer<typeof formSchema>,
    e: React.BaseSyntheticEvent
  ) {
    e.preventDefault();
    setSubmitting(true);
    toast.loading('Creating your school...', { id: 'create-school' });
    try {
      const school = await createSchool(values);
      toast.success('School created. Redirecting you shortly.', {
        id: 'create-school'
      });
      setTimeout(() => {
        router.push(`/school/${school}/dashboard`);
      }, 600);
    } catch {
      toast.error('Failed to create school', { id: 'create-school' });
      setSubmitting(false);
    }
  }

  return (
    <div className="overflow-y-scroll overflow-x-hidden w-screen h-screen snap-y snap-mandatory scroll-smooth relative">
      <div className="absolute top-0 left-0">
        <Link
          href="/school"
          className="ml-16 mt-12 font-grotesque text-sm items-center flex gap-2 text-muted-foreground hover:text-black hover:underline"
        >
          <ChevronLeft size={14} />
          Go back to school selection
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div
            id="basic"
            className="w-screen h-screen flex flex-col items-start justify-center px-16 pb-40 snap-start"
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
                        placeholder="Upload school image"
                        type="file"
                        accept="image/jpg,image/jpeg,image/png,image/svg+xml,image/webp"
                        onChange={async (e) => {
                          if (e.target.files) {
                            let file = e.target.files[0];
                            if (file.size > 5000000) {
                              toast.error('Image size must be less than 5MB');
                              e.target.value = '';
                              return;
                            }
                            let base64 = await getBase64(file);
                            form.setValue('image', base64);
                          }
                        }}
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
            className="w-screen h-screen flex flex-col items-start justify-center px-16 pb-40 snap-start"
          >
            <StepIndicator>Step 2 of 4</StepIndicator>
            <h1 className="font-grotesque font-semibold text-4xl my-2">
              Next...
            </h1>
            <StepDirection>
              Select the plan that suits your school.
            </StepDirection>
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
            className="w-screen h-screen flex flex-col items-start justify-center px-16 pb-40 snap-start"
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
            className="w-screen h-screen flex flex-col items-start justify-center px-16 pb-40 snap-start"
          >
            <StepIndicator>Step 4 of 4</StepIndicator>
            <h1 className="font-grotesque font-semibold text-4xl my-2">
              Just one click away...
            </h1>
            <StepDirection>Double-check before completion.</StepDirection>
            <div className="w-[800px] mt-2 flex gap-6 justify-start">
              <div className="flex flex-col items-start gap-2">
                <span>
                  <span className="font-light text-muted-foreground font-grotesque">
                    School Name:
                  </span>{' '}
                  {form.watch('name')}
                </span>
                <span>
                  <span className="font-light text-muted-foreground font-grotesque">
                    Timezone:
                  </span>{' '}
                  {form.watch('timezone')}
                </span>
                {/* <span>
                  <span className="font-light text-muted-foreground font-grotesque">Opening At({form.watch('timezone')}):</span>{' '}
                  {form.watch('openingAt')}
                </span> */}
                <span>
                  <span className="font-light text-muted-foreground font-grotesque">
                    Quota:
                  </span>{' '}
                  {form.watch('quota')}
                </span>
                <span>
                  <span className="font-light text-muted-foreground font-grotesque">
                    Max Assigned:
                  </span>{' '}
                  {form.watch('maxAssigned')}
                </span>
                <span>
                  <span className="font-light text-muted-foreground font-grotesque">
                    Drop Enabled:
                  </span>{' '}
                  {form.watch('dropEnabled') ? 'Yes' : 'No'}
                </span>
                <span>
                  <span className="font-light text-muted-foreground font-grotesque">
                    Promotion Code:
                  </span>{' '}
                  {form.watch('code')}
                </span>
              </div>
              <Avatar className="w-16 h-16 rounded-md shadow-md">
                <AvatarImage
                  className="w-16 h-16 rounded-md shadow-md"
                  src={form.watch('image')}
                />
                <AvatarFallback className="w-16 h-16 rounded-md shadow-md">
                  <div className="bg-gray-300" />
                </AvatarFallback>
              </Avatar>
            </div>
            <StepNavigator step={4} />
          </div>
        </form>
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

function StepNavigator({ step }: { step: number }) {
  const steps = ['Basic', 'Plan', 'Advanced', 'Review', 'x'];
  const submitting = useSubmitting((states) => states.submitting);

  return (
    <div className="flex justify-between items-center w-[500px] mt-6">
      <div>
        <Button
          variant="outline"
          className={step === 1 ? 'hidden' : ''}
          disabled={submitting}
        >
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
        {step === 4 ? (
          <Button disabled={submitting}>
            <span className={'flex gap-2 items-center justify-end'}>
              <Check />
              Complete
            </span>
          </Button>
        ) : (
          <Button disabled={submitting}>
            <Link
              className={'flex gap-2 items-center justify-end'}
              href={`#${steps[step].toLowerCase()}`}
            >
              Next
              <ChevronRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
