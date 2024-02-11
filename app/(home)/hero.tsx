import { Separator } from '../../components/ui/separator';

export default function Hero({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full flex justify-center items-center flex-col mt-36">
      <p className={`font-extrabold text-5xl mb-3 text-center font-grotesque`}>
        {title}
      </p>

      <p className="text-2xl">{description}</p>

      <Separator className="bg-foreground w-4/5 my-20" />
    </div>
  );
}
