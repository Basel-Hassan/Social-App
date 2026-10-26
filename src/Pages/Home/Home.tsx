import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorState from "../../Components/Error/ApiError";
import CreatePost from "../../Components/Post/CreatePost";
import PostCard from "../../Components/Post/PostCard";
import PostSkeleton from "../../Components/Post/PostSkeleton";
import type { PostType } from "../../Types/Post.type";
import { Helmet } from "react-helmet";
export default function Home() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  function getAllPosts(page: number) {
    return axios
      .get("https://route-posts.routemisr.com/posts", {
        params: {
          sort: "-createdAt",
          page,
          limit: 40,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => res.data);
  }

  const {
    data,
    isError,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["getAllPosts"],
    queryFn: ({ pageParam }) => getAllPosts(pageParam),
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.meta.pagination.nextPage ?? undefined,
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasNextPage || isFetching) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching]);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Elvora | Home</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
          <div className="mx-auto w-full max-w-2xl">
            <PostSkeleton />
          </div>
        </div>
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Helmet>
          <title>Elvora | Home</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
          <div className="mx-auto w-full max-w-2xl">
            <ErrorState
              message={
                axios.isAxiosError<{ message?: string }>(error)
                  ? error.response?.data?.message
                  : error.message
              }
              refetch={refetch}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Elvora | Home</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-36 pt-3">
        <div className="mx-auto w-full max-w-2xl">
          <CreatePost />

          <div className="space-y-6">
            {data?.pages
              .flatMap((page) => page.data.posts)
              .map((post: PostType) => {
                return (
                  <PostCard
                    data={post}
                    isPostDetails={false}
                    key={post.id}
                    path={"/"}
                  />
                );
              })}

            <div ref={sentinelRef} className="py-4 text-center">
              {isFetchingNextPage && <PostSkeleton />}

              {!hasNextPage && (
                <p className="text-sm text-gray-500">No More Posts.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
