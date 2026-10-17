import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

export default function ErrorState({ message , refetch }: { message?: string , refetch:(options?: RefetchOptions) => Promise<QueryObserverResult>}) {
  return (
    <div
      role="alert"
      className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl shadow-red-100/60 ring-1 ring-red-100 sm:p-10"
    >
      {/* Icon */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-8 ring-red-50/60">
        <FiAlertTriangle className="text-3xl" />
      </div>

      {/* Text */}
      <h2 className="text-xl font-bold text-slate-900">
        Something went wrong
      </h2>
      <p className="mt-1.5 text-sm text-slate-500">
        We couldn't load the posts. Please try again.
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
        className="group mx-auto mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        onClick={() => {refetch()}}
      >
        <FiRefreshCw className="transition group-hover:rotate-180" />
        Try again
      </button>
    </div>
  );
}