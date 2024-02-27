'use server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../amazon';

export default async function RemoveImage(url: string) {
  let key = url.split('/').pop();
  // replace + with space
  key = key.replace(/\+/g, ' ');
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key
  };
  const command = new DeleteObjectCommand(params);
  try {
    await s3.send(command);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
