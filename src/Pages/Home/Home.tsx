import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorState from "../../Components/Error/ApiError";
import CreatePost from "../../Components/Post/CreatePost";
import PostCard from "../../Components/Post/PostCard";
import PostSkeleton from "../../Components/Post/PostSkeleton";
import type { PostType } from "../../Types/Post.type";
export default function Home() {
  function getAllPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/posts?sort=-createdAt",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isError, isLoading, error, refetch } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
        <div className="mx-auto w-full max-w-2xl">
          <PostSkeleton />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
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
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-10 pt-3">
        <div className="mx-auto w-full max-w-2xl">
          <CreatePost />

          <div className="space-y-6">
            {data?.data.data.posts.map((post: PostType) => {
              return (
                <PostCard
                  data={post}
                  isPostDetails={false}
                  key={post.id}
                  path={"/"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
