import { Button } from "@/components/button";
import { useSearchParams } from "next/navigation";

export function TagFilters({ options, path }: { path: string, options: string[] | { tag: string, count: number }[] }) {
  const query = useQuery();
  const tags = options.map(option => (typeof option === 'string' ? option : option.tag).toLowerCase());
  if (!/all/i.test(tags[0])) tags.unshift('all');

  return (
    <section className="mb-16 select-none">
      <h3 className="font-bold">Filter by type:</h3>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
        {tags.map(option => {
          const param = option === 'all' ? null : option.toLowerCase().replaceAll(' ', '-')
          return (
            <Button key={option} data-p={param} variant={param && param === query ? 'primary' : 'secondary'} href={param ? `${path}?q=${param}` : path} scroll={false}>{option}</Button>
          )
        })}
      </div>
    </section>
  )
}

export function useQuery() {
  const params = useSearchParams();
  return params.get('q');
}

export function getTags(entries: { tags: string[] }[], { count = 99, threshold = 1 } = {}): { tag: string, count: number }[] {
  return entries.flatMap((entry) => entry.tags).reduce((acc, tag) => {
    const existing = acc.find((t) => t.tag === tag);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ tag, count: 1 });
    }
    return acc;
  }, []).filter(x => x.count > threshold).sort((a, b) => b.count - a.count).slice(0, count).sort((a, b) => a.tag.localeCompare(b.tag));
}
