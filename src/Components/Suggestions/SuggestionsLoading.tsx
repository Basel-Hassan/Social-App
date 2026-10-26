import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SuggestionsLoading({
  count = 10,
  isFull = true,
}: {
  count?: number;
  isFull: boolean;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading suggestions"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-10 pt-3"
    >
      <div className="mx-auto w-full max-w-2xl">
        {isFull && (
          <div className="mb-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
            <Skeleton width={48} height={48} borderRadius={16} />

            <div className="min-w-0 flex-1">
              <Skeleton width="55%" height={22} />
              <Skeleton width="75%" height={12} />
            </div>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-3xl bg-white p-5 text-center shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100"
            >
              <Skeleton circle width={80} height={80} />

              <div className="mt-3 w-full">
                <Skeleton width="55%" height={16} />
                <Skeleton width="40%" height={12} />
              </div>

              <div className="mt-3 flex items-center justify-center gap-3">
                <Skeleton width={78} height={24} borderRadius={999} />
                <Skeleton width={70} height={12} />
              </div>

              <div className="mt-4 w-full">
                <Skeleton height={40} borderRadius={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
