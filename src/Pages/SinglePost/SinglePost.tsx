import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import ErrorState from "../../Components/Error/ApiError";
import PostCard from "../../Components/Post/PostCard";
import PostSkeleton from "../../Components/Post/PostSkeleton";

export default function SinglePost() {
  const { id } = useParams();

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isError, isLoading, error, refetch } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getSinglePost,
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
          <ErrorState message={error.message} refetch={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="space-y-6">
          {/* Post */}
          <PostCard
            data={data?.data.data.post}
            isPostDetails={true}
            path={"/profile"}
          />
        </div>
      </div>
    </div>
  );
}
