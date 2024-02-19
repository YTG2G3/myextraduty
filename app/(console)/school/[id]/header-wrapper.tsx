import { Separator } from '@/components/ui/separator';

export default function HeaderWrapper({ children, title }) {
  return (
    <div className="h-screen overflow-auto p-12">
      <h1 className="mb-2 text-4xl font-semibold">{title}</h1>
      <Separator />
      <div className="mt-2">{children}</div>
    </div>
  );
}
