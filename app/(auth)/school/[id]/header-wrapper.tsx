import { Separator } from '@/components/ui/separator';

export default function HeaderWrapper({ children, title }) {
  return (
    <div className="p-12 h-screen overflow-auto">
      <h1 className="font-semibold text-4xl mb-2">{title}</h1>
      <Separator />
      <div className="mt-2">{children}</div>
    </div>
  );
}
