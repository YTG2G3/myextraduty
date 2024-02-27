'use client';

import { Input } from '@/components/ui/input';

export default function SearchBar({
  search,
  setSearch
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  return (
    <div>
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
