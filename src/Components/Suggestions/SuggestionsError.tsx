import { FiAlertTriangle, FiRefreshCw, FiUserPlus } from "react-icons/fi";

export default function SuggestionsError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-10 pt-3">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-200">
            <FiUserPlus />
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              People you may know
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Follow people to see their posts in your feed.
            </p>
          </div>
        </div>

        {/* Error card */}
        <div
          role="alert"
          className="rounded-3xl bg-white px-6 py-12 text-center shadow-xl shadow-red-100/60 ring-1 ring-red-100"
        >
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl text-red-500 ring-8 ring-red-50/60">
            <FiAlertTriangle />
          </div>

          {/* Text */}
          <h2 className="text-lg font-bold text-slate-900">
            Couldn't load suggestions
          </h2>
          <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500">
            Something went wrong while getting people for you. Please try again.
          </p>

          {/* API error message */}
          {message && (
            <p className="mx-auto mt-4 max-w-sm break-words rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              {message}
            </p>
          )}

          {/* Retry */}
          <button
            type="button"
            onClick={onRetry}
            className="group mx-auto mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            <FiRefreshCw className="transition group-hover:rotate-180" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}