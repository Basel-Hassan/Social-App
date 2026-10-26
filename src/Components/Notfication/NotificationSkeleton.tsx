import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NotificationSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-start gap-3 rounded-2xl p-3">
          <div className="relative shrink-0">
            <Skeleton circle width={40} height={40} />
            <span className="absolute -bottom-1 -right-1 rounded-full ring-2 ring-white">
              <Skeleton circle width={20} height={20} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <Skeleton width="85%" height={12} />
            <Skeleton width="45%" height={12} />

            <div className="mt-1">
              <Skeleton width={64} height={10} />
            </div>

            <div className="mt-2">
              <Skeleton width={92} height={26} borderRadius={8} />
            </div>
          </div>
        </li>
      ))}
    </>
  );
}