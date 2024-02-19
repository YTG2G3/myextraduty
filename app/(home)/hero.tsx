import { Separator } from '../../components/ui/separator';

export default function Hero({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-36 flex w-full flex-col items-center justify-center">
      <p className={`mb-3 text-center font-grotesque text-5xl font-extrabold`}>
        {title}
      </p>

      <p className="text-2xl">{description}</p>

      <Separator className="my-20 w-4/5 bg-foreground" />
    </div>
  );
}
