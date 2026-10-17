import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import ErrorState from "../../Components/Error/ApiError";
import PostCard from "../../Components/Post/PostCard";
import PostSkeleton from "../../Components/Post/PostSkeleton";

export default function SinglePost() {
//     {
//   post,
//   comments,
// }: {
//   post: PostType;
//   comments: TopComment[];
// }

    const {id} = useParams()

    function getSinglePost() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}` , {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

      const {data , isError , isLoading , error , refetch} = useQuery({
        queryKey : ["getSinglePost", id], 
        queryFn : getSinglePost
      }) 
    
       if (isLoading) {
         return <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10" >
          <div className="mx-auto w-full max-w-2xl">
            <PostSkeleton />
          </div>
          </div>
       }
       if (isError) {
         return <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10" >
          <div className="mx-auto w-full max-w-2xl">
            <ErrorState message={error.message} refetch={refetch} />
          </div>
          </div>
       }


    
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiArrowLeft className="text-lg" />
          Back to posts
        </Link>

        <div className="space-y-6">
          {/* Post */}
          <PostCard data={data?.data.data.post} isPostDetails={true} />

        </div>
      </div>
    </div>
  );
}