import { FiArrowRight, FiBookmark } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function BookmarksEmpty() {
  return (
    <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl text-indigo-400 ring-8 ring-indigo-50/60">
        <FiBookmark />
      </div>

      <h2 className="text-lg font-bold text-slate-900">No saved posts yet</h2>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500">
        Tap the Save button on any post and it will show up here for later.
      </p>

      <Link
        to="/"
        className="group mx-auto mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
      >
        Browse posts
        <FiArrowRight className="transition group-hover:translate-x-1" />
      </Link>
    </div>
  );
}