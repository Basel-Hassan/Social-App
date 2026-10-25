import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

// Renders an <li>, same layout as FolloersCard
export default function FollowersCardError({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <li
      role="alert"
      className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-2.5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl text-red-500 ring-2 ring-red-100">
        <FiAlertCircle />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-red-700">
          Couldn't load user
        </p>
        <p className="truncate text-xs text-red-500">Please try again.</p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-600 hover:text-white hover:ring-red-600 focus:outline-none focus:ring-4 focus:ring-red-100"
      >
        <FiRefreshCw className="text-sm transition group-hover:rotate-180" />
        <span className="hidden sm:inline">Retry</span>
      </button>
    </li>
  );
}