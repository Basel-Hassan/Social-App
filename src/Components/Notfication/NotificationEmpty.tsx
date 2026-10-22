import { FiBellOff } from "react-icons/fi";

// Renders an <li>, so put it inside the notifications <ul>
export default function NotificationEmpty() {
  return (
    <li className="flex flex-col items-center px-6 py-10 text-center">
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl text-indigo-400 ring-8 ring-indigo-50/60">
        <FiBellOff />
      </div>

      {/* Text */}
      <p className="text-sm font-bold text-slate-900">No notifications yet</p>
      <p className="mt-1 max-w-[16rem] text-xs text-slate-500">
        When someone likes, comments on, or shares your posts, you'll see it
        here.
      </p>
    </li>
  );
}