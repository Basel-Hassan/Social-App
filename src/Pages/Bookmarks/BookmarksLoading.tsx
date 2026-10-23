import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PostSkeleton from "../../Components/Post/PostSkeleton";

export default function BookmarksLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading saved posts"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-10 pt-3"
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
          <Skeleton width={48} height={48} borderRadius={16} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton width={140} height={22} />
              <Skeleton width={28} height={20} borderRadius={999} />
            </div>
            <Skeleton width="60%" height={12} />
          </div>
        </div>

        <div className="space-y-6">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </div>
    </div>
  );
}