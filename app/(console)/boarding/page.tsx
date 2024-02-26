'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
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
      timezone: '',
      name: '',
      image: '',
      openingAt: '',
      quota: 0,
      maxAssigned: 0,
      dropEnabled: false,
      code: ''
    }
  });

  return <h1>Boarding</h1>;
}
