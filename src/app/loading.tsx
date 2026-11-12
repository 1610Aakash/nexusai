import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-6 lg:p-10">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-5 w-80 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </main>
  );
}
