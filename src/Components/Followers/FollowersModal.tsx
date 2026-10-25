import { FiUsers, FiX } from "react-icons/fi";
import FolloersCard from "./FolloersCard";

export interface FollowerUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount?: number;
}

export default function FollowersModal({
  users,
  closeFn,
  isMyProfile,
}: {
  users: string[];
  closeFn: React.Dispatch<React.SetStateAction<boolean>>;
  isMyProfile: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="followers-title"
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
    >
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-white p-5 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-100 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">
            <FiUsers />
          </span>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h2
              id="followers-title"
              className="text-lg font-bold text-slate-900"
            >
              Followers
            </h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {users.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              closeFn(false);
            }}
            aria-label="Close"
            className="cursor-pointer rounded-full p-2 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX />
          </button>
        </div>

        {/* List */}
        {users.length > 0 ? (
          <ul className="-mx-2 flex-1 space-y-1 overflow-y-auto px-2">
            {users.map((user) => (
              <FolloersCard user={user}  isMyProfile={isMyProfile}/>
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center">
            <FiUsers className="mx-auto text-4xl text-slate-300" />
            <p className="mt-2 text-sm font-medium text-slate-500">
              No followers yet
            </p>
            <p className="text-xs text-slate-400">
              When people follow this account, they'll show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
