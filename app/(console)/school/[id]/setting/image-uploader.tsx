import { Button } from '@/components/ui/button';
import RemoveImage from '@/lib/actions/remove-image';
import UploadImage, { ModifySchoolImage } from '@/lib/actions/upload-image';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ImageUploader({
  image,
  school_id
}: {
  image: string;
  school_id: string;
}) {
  const inputFile = useRef(null);
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    inputFile.current.click();
  };

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDisabled(true);

      toast.loading('Uploading image...', { id: 'uploading' });

      if (e.target.files[0].size > 5000000) {
        toast.error('Image size must be less than 5MB', { id: 'uploading' });
        setDisabled(false);
        return;
      }

      await RemoveImage(image);
      try {
        const new_image = await getBase64(e.target.files[0]);

        const key = await UploadImage(new_image);
        await ModifySchoolImage(key, school_id);
        toast.success('Image uploaded', { id: 'uploading' });
      } catch {
        toast.error('Failed to upload image', { id: 'uploading' });
      } finally {
        setDisabled(false);
        location.reload();
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold font-grotesque">
        Change school photo
      </h1>
      <div className="flex items-start gap-4 mt-2">
        <Image
          src={image}
          alt="logo"
          width={120}
          height={120}
          className="rounded-lg shadow-md"
        />
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClick}>
            Upload new image
          </Button>
        </div>
        <input
          type="file"
          id="file"
          accept="image/png,image/jpg,image/jpeg,image/svg+xml,image/webp"
          ref={inputFile}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
