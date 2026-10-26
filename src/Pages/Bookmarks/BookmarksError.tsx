import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

interface ErrorDesignProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export default function BookmarksError({
  title = "Something went wrong",
  message = "We couldn't load your saved posts. Please check your connection and try again.",
  onRetry,
}: ErrorDesignProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-10 pt-3">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center pt-16 sm:pt-24">
        <div className="w-full rounded-3xl bg-white p-8 text-center shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 ring-1 ring-rose-100">
            <FiAlertTriangle className="h-8 w-8 text-rose-500" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            {message}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.98] sm:w-auto"
              >
                <FiRefreshCw className="h-4 w-4" />
                Try again
              </button>
            )}
            
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-50 sm:w-auto"
            >
              <FiHome className="h-4 w-4" />
              Go home
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}
