import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

interface ErrorDesignProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function NotficationError({
  title = "Something went wrong",
  message = "We couldn't load the notifications. Please try again.",
  onRetry,
  className = "",
}: ErrorDesignProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-10 text-center ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-100">
        <FiAlertCircle className="h-7 w-7 text-rose-500" />
      </div>

      <div className="space-y-1.5">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="max-w-[240px] text-xs leading-relaxed text-slate-500">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          <FiRefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}