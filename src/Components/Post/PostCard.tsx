import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FiBookmark,
  FiGlobe,
  FiHeart,
  FiMessageCircle,
  FiShare2
} from "react-icons/fi";
import { Link } from "react-router-dom";
import type { CommentType } from "../../Types/Coment.type";
import type { PostType } from "../../Types/Post.type";
import CommentInput from "../Comment/CommentInput";
import TopComment from "../Comment/TopComment";
import ErrorState from "../Error/ApiError";
import PostMenu from "./PostMenu";
import PostSkeleton from "./PostSkeleton";

export default function PostCard({
  data,
  isPostDetails = false,
}: {
  data: PostType;
  isPostDetails: boolean;
}) {
  const {
    body,
    user,
    createdAt,
    image,
    sharesCount,
    commentsCount,
    likesCount,
    topComment,
    _id,
  } = data;
  const { name, photo, username , _id:userId } = user;

  function getAllComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const {
    data: Data,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAllComments", _id],
    queryFn: getAllComments,
    enabled: isPostDetails,
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
    <article className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        
        <img
          src={photo}
          alt={name}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-indigo-100"
        />

        <div className="min-w-0 flex-1">
          <p
            dir="auto"
            className="truncate text-sm font-semibold text-slate-900"
          >
            {name}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="truncate">@{username}</span>
            <span>·</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            <FiGlobe />
          </p>
        </div>

        <PostMenu userId={userId} _id={_id}/>
      </div>

      {/* Body */}
      {body && (
        <p
          dir="auto"
          className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-slate-800"
        >
          {body}
        </p>
      )}

      {/* Image */}
      {image && (
        <img
          src={image}
          alt="Post"
          loading="lazy"
          className="mt-4 max-h-[28rem] w-full rounded-2xl object-cover ring-1 ring-slate-100"
        />
      )}

      {/* Counts */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{likesCount} likes</span>
        <span className="flex gap-3">
          <span>{commentsCount} comments</span>
          <span>{sharesCount} shares</span>
        </span>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-2">
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiHeart className="text-lg" />
          Like
        </button>

        
          <Link
            to={`/postdetails/${_id}`}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <FiMessageCircle className="text-lg" />
            Comment
          </Link>
        

        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiShare2 className="text-lg" />
          Share
        </button>

        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiBookmark className="text-lg" />
          Save
        </button>
      </div>

      <CommentInput postId={_id} isRefetch={isPostDetails? ["getAllComments", _id] : ["getAllPosts"]}/>
      {/* Top comment */}

      

      {isPostDetails ?
        Data?.data.data.comments?.map((comment: CommentType) => (
          <TopComment key={comment._id} topComment={comment} />
        )):topComment && <TopComment topComment={topComment} />}
    </article>
  );
}
