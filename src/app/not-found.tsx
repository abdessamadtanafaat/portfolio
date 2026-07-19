import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <p className="text-6xl font-bold text-slate-200 dark:text-slate-800 mb-4">
          404
        </p>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Page not found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
