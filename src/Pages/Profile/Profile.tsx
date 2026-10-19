import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  FiAlertCircle,
  FiBookmark,
  FiCalendar,
  FiCamera,
  FiEdit2,
  FiRefreshCw,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import PostCard from "../../Components/Post/PostCard";
import { PostType } from "../../Types/Post.type";
import { UserType } from "../../Types/userProfile.type";
import CreatePost from "../../Components/Post/CreatePost";
import { useRef } from "react";
import toast from "./../../../node_modules/react-hot-toast/src/index";

export default function Profile() {
  const Query = useQueryClient();
  const photoInput = useRef<HTMLInputElement>(null);
  const formData = new FormData();
  function myProfileApi() {
    return axios.get(
      `https://route-posts.routemisr.com/users/profile-data`,

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myProfileApi"],
    queryFn: myProfileApi,
  });

  const user: UserType = data?.data.data.user;

  function userPostsApi() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${user._id}/posts`,

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const {
    data: userPostsData,
    isLoading: userPostsIsLoading,
    isError: userPostsIsError,
    error: userPostsError,
  } = useQuery({
    queryKey: ["userPostsApi"],
    queryFn: userPostsApi,
    enabled: !isLoading && !isError && !!data,
  });

  const posts = userPostsData?.data.data.posts;

  function uploadProfilePhotoApi(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate } = useMutation<
    AxiosResponse<{ message?: string }>,
    AxiosError<{ message?: string }>,
    FormData
  >({
    mutationFn: uploadProfilePhotoApi,
  });

  function handleUploadPhoto() {
    const photo = photoInput.current?.files?.[0];

    if (!photo) return;

    if (photo) formData.append("photo", photo);

    const toastId = toast.loading("Uploading profile photo...");
    mutate(formData, {
      onSuccess: (res) => {
        toast.success(res.data.message ?? "Photo uploaded successfully", { id: toastId });
        Query.invalidateQueries({ queryKey: ["myProfileApi"] });
        Query.invalidateQueries({ queryKey: ["userPostsApi"] });
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || err.message || "Something went wrong",
          { id: toastId },
        );
      },
    });
  }

  if (isLoading || userPostsIsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-10 pt-3">
        <div className="mx-auto w-full max-w-2xl">
          {/* Profile Header Skeleton */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100">
            {/* Cover skeleton */}
            <div className="h-36 animate-pulse bg-gradient-to-r from-indigo-100 via-sky-100 to-indigo-100 sm:h-44" />

            <div className="relative px-5 pb-6 sm:px-6">
              {/* Avatar + buttons */}
              <div className="-mt-12 mb-4 flex items-end justify-between sm:-mt-14">
                <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200 ring-4 ring-white sm:h-28 sm:w-28" />

                <div className="flex gap-2">
                  <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>

              {/* Name & username */}
              <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
              </div>

              {/* Meta */}
              <div className="mt-3 flex gap-4">
                <div className="h-3.5 w-28 animate-pulse rounded-full bg-slate-100" />
                <div className="h-3.5 w-24 animate-pulse rounded-full bg-slate-100" />
              </div>

              {/* Stats */}
              <div className="mt-5 flex gap-6 border-t border-slate-100 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-5 w-8 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-3 w-14 animate-pulse rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Posts section title */}
          <div className="mb-4 mt-6 px-1">
            <div className="h-4 w-16 animate-pulse rounded-full bg-slate-200" />
          </div>

          {/* Posts skeletons */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/40 ring-1 ring-slate-100 sm:p-6"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-28 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
                  </div>
                </div>

                {/* Body lines */}
                <div className="mt-4 space-y-2">
                  <div className="h-3.5 w-full animate-pulse rounded-full bg-slate-100" />
                  <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-3.5 w-3/5 animate-pulse rounded-full bg-slate-100" />
                </div>

                {/* Image placeholder */}
                <div className="mt-4 h-48 animate-pulse rounded-2xl bg-slate-100" />

                {/* Actions */}
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-9 flex-1 animate-pulse rounded-xl bg-slate-50"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || userPostsIsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-10">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl text-rose-400 shadow-inner">
            <FiAlertCircle />
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-slate-900">
            Couldn’t load profile
          </h2>

          {/* Message */}
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {error?.message || userPostsError?.message}
          </p>

          {/* Retry button */}
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 cursor-pointer rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-600 active:scale-[0.98]"
            onClick={() => {
              Query.invalidateQueries({ queryKey: ["myProfileApi"] });
              Query.invalidateQueries({ queryKey: ["userPostsApi"] });
            }}
          >
            <FiRefreshCw className="text-base" />
            Try again
          </button>

          {/* Hint */}
          <p className="mt-5 text-xs text-slate-400">
            Check your connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-10 pt-3">
      <div className="mx-auto w-full max-w-2xl">
        {/* ===== Profile Header Card ===== */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 mb-7">
          {/* Cover */}
          <div className="relative h-36 bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-300 sm:h-44">
            {user.cover ? (
              <img
                src={user.cover}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          {/* Avatar + Info */}
          <div className="relative px-5 pb-6 sm:px-6">
            {/* Avatar */}
            <div className="-mt-12 mb-4 flex items-end justify-between sm:-mt-14">
              <div className="relative group">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg sm:h-28 sm:w-28"
                />
                <label className="absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md ring-2 ring-white transition-all hover:bg-indigo-600 hover:scale-105 active:scale-95 sm:h-9 sm:w-9 cursor-pointer">
                  <FiCamera className="text-sm sm:text-base" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={photoInput}
                    onChange={handleUploadPhoto}
                  />
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-600 active:scale-[0.98]"
                >
                  <FiUserPlus className="text-base" />
                  Follow
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                >
                  <FiEdit2 className="text-base" />
                </button>
              </div>
            </div>

            {/* Name & Username */}
            <div>
              <h1
                dir="auto"
                className="text-xl font-bold text-slate-900 sm:text-2xl"
              >
                {user.name}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">@{user.username}</p>
            </div>

            {/* Meta info */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="text-sm" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {user.dateOfBirth && (
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-sm" />
                  Born{" "}
                  {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="mt-5 flex gap-6 border-t border-slate-100 pt-4">
              <button
                type="button"
                className="group flex flex-col items-start transition"
              >
                <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">
                  {user.followersCount}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <FiUsers className="text-sm" />
                  Followers
                </span>
              </button>

              <button
                type="button"
                className="group flex flex-col items-start transition"
              >
                <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">
                  {user.followingCount}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <FiUsers className="text-sm" />
                  Following
                </span>
              </button>

              <button
                type="button"
                className="group flex flex-col items-start transition"
              >
                <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">
                  {user.bookmarksCount}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <FiBookmark className="text-sm" />
                  Bookmarks
                </span>
              </button>
            </div>
          </div>
        </div>

        <CreatePost />

        <div className="mt-6">
          <div className="space-y-6">
            {posts ? (
              <>
                {posts.map((post: PostType) => (
                  <PostCard
                    key={post._id}
                    data={post}
                    isPostDetails={false}
                    path={"/profile"}
                  />
                ))}
              </>
            ) : (
              <div className="rounded-3xl bg-white py-14 text-center shadow-xl shadow-indigo-100/40 ring-1 ring-slate-100">
                <p className="text-sm font-medium text-slate-500">
                  No posts yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  When this user posts, you’ll see them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
