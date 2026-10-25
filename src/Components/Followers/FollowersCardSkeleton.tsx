import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function FollowersCardSkeleton() {
  return (
    <li
      aria-busy="true"
      aria-label="Loading user"
      className="flex items-center gap-3 rounded-2xl p-2.5"
    >

      <Skeleton circle width={44} height={44} />

      <div className="min-w-0 flex-1">
        <Skeleton width="55%" height={14} />
        <Skeleton width="35%" height={11} />
      </div>

      <Skeleton width={84} height={30} borderRadius={999} />
    </li>
  );
}