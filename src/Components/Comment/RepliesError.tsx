import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function RepliesError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="mt-3 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3"
    >
      <FiAlertCircle className="mt-0.5 shrink-0 text-base text-red-500" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-red-700">
          Couldn't load replies
        </p>
        {message && (
          <p className="mt-0.5 break-words text-xs text-red-600">{message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-red-200 transition hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-100"
      >
        <FiRefreshCw className="transition group-hover:rotate-180" />
        Retry
      </button>
    </div>
  );
}