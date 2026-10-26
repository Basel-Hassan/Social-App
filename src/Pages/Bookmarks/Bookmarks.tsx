import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiBookmark } from "react-icons/fi";
import { PostType } from "../../Types/Post.type";
import PostCard from "../../Components/Post/PostCard";
import BookmarksEmpty from "../../Components/Bookmarks/BookmarksEmpty";
import BookmarksLoading from "./BookmarksLoading";
import BookmarksError from "./BookmarksError";
import { Helmet } from "react-helmet";

export default function Bookmarks() {
  function BookmarksApi() {
    return axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getBookMarks"],
    queryFn: BookmarksApi,
  });

  const bookmarksData = data?.data.data.bookmarks || [];

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Elvora | Bookmarks</title>
        </Helmet>
        <BookmarksLoading />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Helmet>
          <title>Elvora | Bookmarks</title>
        </Helmet>
        <BookmarksError
          onRetry={() => {
            refetch();
          }}
          message={
            axios.isAxiosError<{ message?: string }>(error)
              ? error.response?.data?.message
              : error.message
          }
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Elvora | Bookmarks</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-36 pt-3">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-200">
              <FiBookmark />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Saved posts
                </h1>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                  {bookmarksData.length}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">
                Posts you've bookmarked will appear here.
              </p>
            </div>
          </div>

          {bookmarksData.length > 0 ? (
            <div className="space-y-6">
              {bookmarksData.map((post: PostType) => {
                return (
                  <PostCard
                    data={post}
                    isPostDetails={false}
                    key={post.id}
                    path={"/bookmarks"}
                  />
                );
              })}
            </div>
          ) : (
            <BookmarksEmpty />
          )}
        </div>
      </div>
    </>
  );
}
