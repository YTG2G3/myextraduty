import { ChevronsDown, MousePointer } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <div className="flex items-center sm:flex-col md:flex-col lg:flex-row ">
        <p
          className={`mb-3 mr-3 text-center font-grotesque text-7xl font-extrabold`}
        >
          As simple as clicking a button
        </p>
        <MousePointer width={60} height={60} />
      </div>

      <p className="text-2xl">An easy way to manage your extra duties.</p>

      <ChevronsDown
        width={80}
        height={80}
        className="absolute bottom-16 animate-bounce"
      />
    </div>
  );
}
