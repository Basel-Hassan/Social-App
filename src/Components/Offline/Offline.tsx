import { FiRefreshCw, FiWifiOff } from "react-icons/fi";

export default function Offline({ onRetry }: { onRetry?: () => void }) {
 return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      className="fixed inset-0 z-[100] flex cursor-not-allowed items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm cursor-default rounded-3xl bg-white p-8 text-center shadow-2xl shadow-slate-900/30 ring-1 ring-slate-100">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-8 ring-red-50/60">
          <FiWifiOff className="text-3xl" />
        </div>
 
        <h2 id="offline-title" className="text-xl font-bold text-slate-900">
          You're offline
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Check your internet connection. You can keep using the app once
          you're back online.
        </p>
 
        <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Waiting for connection...
        </div>
 
        <button
          type="button"
          onClick={onRetry}
          className="group mx-auto mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          <FiRefreshCw className="transition group-hover:rotate-180" />
          Try again
        </button>
      </div>
    </div>
  );
}