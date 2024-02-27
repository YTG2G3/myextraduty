'use server';

import UploadImage from '@/lib/actions/upload-image';
import getServerSession from '@/lib/get-server-session';
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

export async function createSchool(value: z.infer<typeof formSchema>) {
  if (value.code !== 'huskies') return null;

  const session = await getServerSession();

  // upload image
  try {
    const image_key = await UploadImage(value.image);
    // create school
    const school = await prisma.school.create({
      data: {
        ownerId: session.user.id,
        name: value.name,
        image: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${image_key}.png`,
        timezone: value.timezone,
        openingAt: new Date(value.openingAt),
        quota: value.quota,
        maxAssigned: value.maxAssigned,
        dropEnabled: value.dropEnabled
      }
    });
    // create enrollment
    await prisma.enrollment.create({
      data: {
        manager: true,
        schoolId: school.id,
        userId: session.user.id
      }
    });
    return school.id;
  } catch (error) {
    return null;
  }
}
