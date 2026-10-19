import { FiHome, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-10">
        
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl text-indigo-400 shadow-inner">
          <FiAlertCircle />
        </div>

        {/* 404 Number */}
        <p className="text-6xl font-extrabold tracking-tight text-indigo-100 sm:text-7xl">
          404
        </p>

        {/* Title */}
        <h1 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          The page you’re looking for doesn’t exist or has been moved.
          Let’s get you back home.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-600 active:scale-[0.98]"
        >
          <FiHome className="text-lg" />
          Back to Home
        </Link>

        {/* Subtle hint */}
        <p className="mt-6 text-xs text-slate-400">
          Check the URL or try searching for something else.
        </p>
      </div>
    </div>
  );
}