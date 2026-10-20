import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function RepliesSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading replies"
      className="mt-3 space-y-3 border-l-2 border-slate-100 pl-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-2.5">
          {/* Avatar */}
          <Skeleton circle width={28} height={28} />

          {/* Bubble */}
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl rounded-tl-md bg-slate-100 px-3.5 py-2.5">
              <Skeleton width="30%" height={10} baseColor="#e2e8f0" />
              <Skeleton width="80%" height={12} baseColor="#e2e8f0" />
            </div>

            {/* Date */}
            <div className="mt-1.5 px-2">
              <Skeleton width={56} height={9} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}