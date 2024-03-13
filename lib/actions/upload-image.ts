'use server';
import { s3 } from '@/lib/amazon';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 } from 'uuid';

export default async function uploadImage(image_base64: string) {
  const key = v4();

  // convert base64 to buffer
  const buffer = await sharp(Buffer.from(image_base64, 'base64'))
    .resize(300, 300, { fit: 'contain', background: '#FFFFFF' })
    .flatten({ background: '#FFFFFF' })
    .toFormat('png', { quality: 100, compressionLevel: 9 })
    .toBuffer();

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${key}.png`,
    Body: buffer
  };
  const command = new PutObjectCommand(params);
  try {
    await s3.send(command);
    return key;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to upload image');
  }
}

export async function modifySchoolImage(key: string, school_id: string) {
  const full_url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${key}.png`;
  try {
    await prisma.school.update({
      where: { id: school_id },
      data: { image: full_url }
    });
    return true;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to modify school image');
  }
}
