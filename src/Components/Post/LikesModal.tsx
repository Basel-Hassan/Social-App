import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { FiHeart, FiUsers, FiX } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { LikeUser } from './../../Types/Like.type';
import { useNavigate } from "react-router-dom";


export default function LikesModal({
  users,
  setIsLikeOpen,
  likesIsError,
  likesIsLoading,
  postID
}: {
  users: LikeUser[];
  setIsLikeOpen: Dispatch<SetStateAction<boolean>>;
  likesIsError: boolean;
  likesIsLoading: boolean;
  postID: string;
}) {
  const nivigate = useNavigate()
  const Query = useQueryClient();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="likes-title"
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
    >
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-3xl bg-white p-5 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-100 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-xl text-white shadow-lg shadow-rose-200">
            <FiHeart className="fill-current" />
          </span>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h2 id="likes-title" className="text-lg font-bold text-slate-900">
              Likes
            </h2>
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
              {users.length}
            </span>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              setIsLikeOpen(false);
            }}
            className="cursor-pointer rounded-full p-2 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX />
          </button>
        </div>

        {likesIsLoading && (
          <>
            <div className="flex flex-1 flex-col items-center justify-center py-14">
              <div className="relative mb-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-400">
                  <FiHeart className="fill-current" />
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-100">
                  <ImSpinner className="animate-spin text-sm text-rose-500" />
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-700">
                Loading likes...
              </p>
              <p className="mt-1 text-xs text-slate-400">Just a moment</p>

              <div className="mt-8 w-full space-y-3 px-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl p-2.5"
                  >
                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-100" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-50" />
                    </div>
                    <div className="h-3 w-8 animate-pulse rounded-full bg-slate-50" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {likesIsError && (
          <>
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-400 shadow-inner">
                <FiHeart />
              </span>

              <h3 className="text-sm font-bold text-slate-800">
                Couldn’t load likes
              </h3>
              <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-slate-500">
                Something went wrong while fetching the list. Please try again.
              </p>

              <button
                type="button"
                disabled={likesIsLoading}
                className="mt-6 flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                onClick={() => {
                  Query.invalidateQueries({
                    queryKey: ["getLikes", postID],
                  });
                }}
              >
                <FiHeart className="text-base" />
                Try again
              </button>
            </div>
          </>
        )}

        {!likesIsLoading && !likesIsError ? (
          <>
            {users.length > 0 ? (
              <ul className="-mx-2 flex-1 space-y-1 overflow-y-auto px-2">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl p-2.5 transition hover:bg-indigo-50"
                    onClick={() => {
                      nivigate(`/profile/${user._id}`)
                    }}
                  >
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-indigo-100"
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        dir="auto"
                        className="truncate text-sm font-semibold text-slate-900"
                      >
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        @{user.username}
                      </p>
                    </div>

                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                      <FiUsers />
                      {user.followersCount}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center">
                <FiHeart className="mx-auto text-4xl text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-500">
                  No likes yet
                </p>
                <p className="text-xs text-slate-400">
                  Be the first to like this post.
                </p>
              </div>
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
