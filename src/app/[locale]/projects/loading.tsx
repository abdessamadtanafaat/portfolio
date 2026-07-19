import { ListSkeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <div className="page-container section-padding">
      <div className="mx-auto max-w-6xl container-px">
        <div className="text-center mb-12 space-y-3">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto animate-pulse" />
          <div className="h-5 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto animate-pulse" />
        </div>
        <ListSkeleton count={6} />
      </div>
    </div>
  );
}
