import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PostSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading post"
      className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton circle width={44} height={44} />

        <div className="flex-1">
          <Skeleton width="35%" height={14} />
          <Skeleton width="55%" height={12} />
        </div>

        <Skeleton circle width={32} height={32} />
      </div>

      {/* Body */}
      <div className="mt-4">
        <Skeleton count={2} height={14} />
        <Skeleton width="60%" height={14} />
      </div>

      {/* Image */}
      <Skeleton height={288} borderRadius={16} className="mt-4" />

      {/* Counts */}
      <div className="mt-4 flex items-center justify-between">
        <Skeleton width={60} height={12} />
        <Skeleton width={130} height={12} />
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1">
            <Skeleton height={38} borderRadius={12} />
          </div>
        ))}
      </div>

      {/* Top comment */}
      <div className="mt-4 flex items-start gap-3">
        <Skeleton circle width={36} height={36} />
        <div className="flex-1">
          <Skeleton height={56} borderRadius={16} />
        </div>
      </div>
    </div>
  );
}