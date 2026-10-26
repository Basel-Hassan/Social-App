import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ProfileInfo from "../../Components/Profile/ProfileInfo";
import { PostType } from "../../Types/Post.type";
import PostCard from "../../Components/Post/PostCard";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../Context/LoginContext";
import { Helmet } from "react-helmet";

export default function UserProfile() {
  const { id } = useParams();
  const Query = useQueryClient();
  const navigate = useNavigate();
  const { userId: myId } = useContext(LoginContext);

  useEffect(() => {
    Query.invalidateQueries({ queryKey: ["userPostsApi", id] });
    if (myId == id) {
      navigate("/profile");
    }
  }, [id, navigate]);
  function userProfileApi() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getUserProfile", id],
    queryFn: userProfileApi,
  });

  function userPostsApi() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const {
    data: userPostsData,
    isLoading: userPostsIsLoading,
    isError: userPostsIsError,
    error: userPostsError,
  } = useQuery({
    queryKey: ["userPostsApi", id],
    queryFn: userPostsApi,
    enabled: !isError && !isLoading && !!data,
  });

  const posts = userPostsData?.data.data.posts;

  if (isLoading || userPostsIsLoading) {
    return (
      <>
        <Helmet>
          <title>Elvora | Profile</title>
        </Helmet>
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
      </>
    );
  }

  if (isError || userPostsIsError) {
    return (
      <>
        <Helmet>
          <title>Elvora | Profile</title>
        </Helmet>
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
              {(axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : String(error ?? "")) ||
                (axios.isAxiosError(userPostsError)
                  ? userPostsError.response?.data?.message ||
                    userPostsError.message
                  : String(userPostsError ?? ""))}
            </p>

            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 cursor-pointer rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-600 active:scale-[0.98]"
              onClick={() => {
                Query.invalidateQueries({ queryKey: ["getUserProfile", id] });
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
      </>
    );
  }

  const {
    _id,
    cover,
    photo,
    name,
    username,
    createdAt,
    dateOfBirth,
    followersCount,
    followingCount,
    bookmarksCount,
    following,
    followers,
  } = data!.data.data.user;
  return (
    <>
      <Helmet>
        <title>Elvora | Profile</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-36 pt-3">
        <div className="mx-auto w-full max-w-2xl">
          <ProfileInfo
            userId={_id}
            cover={cover}
            photo={photo}
            name={name}
            username={username}
            createdAt={createdAt}
            dateOfBirth={dateOfBirth}
            followersCount={followersCount}
            followingCount={followingCount}
            bookmarksCount={bookmarksCount}
            following={following}
            followers={followers}
            isMyProfile={false}
          />

          <div className="mt-6">
            <div className="space-y-6">
              {posts ? (
                <>
                  {posts.map((post: PostType) => (
                    <PostCard
                      key={post._id}
                      data={post}
                      isPostDetails={false}
                      path={`/profile/${id}`}
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
    </>
  );
}
