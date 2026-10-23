import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useRef, useState } from "react";
import { FaBookmark, FaHeart } from "react-icons/fa";
import {
  FiBookmark,
  FiGlobe,
  FiHeart,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../Context/LoginContext";
import type { CommentType } from "../../Types/Coment.type";
import type { PostType } from "../../Types/Post.type";
import CommentInput from "../Comment/CommentInput";
import TopComment from "../Comment/TopComment";
import ErrorState from "../Error/ApiError";
import Follow from "../Follow/Follow";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import LikesModal from "./LikesModal";
import PostMenu from "./PostMenu";
import PostSkeleton from "./PostSkeleton";

export default function PostCard({
  data,
  isPostDetails = false,
  path,
}: {
  data: PostType;
  isPostDetails: boolean;
  path: string;
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
    isShare,
    sharedPost,
    bookmarked,
  } = data;
  const { name, photo, username, _id: userId } = user;
  const { userId: myId } = useContext(LoginContext);
  const isLike = data.likes?.includes(myId) ?? false;
  const [isLikeOpen, setIsLikeOpen] = useState(false);
  const query = useQueryClient();
  const { id } = useParams();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const textInput = useRef<HTMLTextAreaElement>(null);
  const isBookmarked = bookmarked;
  const navigate = useNavigate();

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

  function doLikeApi() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}/like`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  function getLikesApi() {
    return axios.get(`https://route-posts.routemisr.com/posts/${_id}/likes`, {
      params: {
        page: 1,
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: doLikeApi,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getSinglePost", id] });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getLikes", _id] });
      query.invalidateQueries({ queryKey: ["userPostsApi" , id] });
      query.invalidateQueries({ queryKey: ["getBookMarks"] });
    },
  });

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

  const {
    data: likesData,
    isError: likesIsError,
    isLoading: likesIsLoading,
  } = useQuery({
    queryKey: ["getLikes", _id],
    queryFn: getLikesApi,
  });

  function shareApi() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${_id}/share`,
      {
        body: textInput?.current?.value || " ",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: shareMutate, isPending: shareIsPending } = useMutation({
    mutationFn: shareApi,
    onSuccess: (res) => {
      toast.success(res.data.message);
      setIsShareOpen(false);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["myProfileApi"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    },
  });

  function doBookmarkApi() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}/bookmark`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: bookmarkMutate, isPending: bookmarkIsPending } = useMutation({
    mutationFn: doBookmarkApi,
    onSuccess: (res) => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["userPostsApi"] });
      query.invalidateQueries({ queryKey: ["getBookMarks"] });
      query.invalidateQueries({ queryKey: ["myProfileApi"] });
      query.invalidateQueries({ queryKey: ["getSinglePost", id] });
      toast.success(res.data.message);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    },
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
    <article className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-center gap-3">
        <img
          src={photo}
          alt={name}
          onClick={() => {
            navigate(`/profile/${userId}`);
          }}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-indigo-100 cursor-pointer"
        />

        <div className="min-w-0 flex-1">
          <p
            dir="auto"
            onClick={() => {
              navigate(`/profile/${userId}`);
            }}
            className="truncate text-sm font-semibold text-slate-900 cursor-pointer hover:underline"
          >
            {name}
            {isShare && (
              <span className="ml-1.5 font-normal text-slate-500">
                shared a post
              </span>
            )}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="truncate">@{username}</span>
            <span>·</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            <FiGlobe />
          </p>
        </div>

        {userId !== myId && <Follow userId={userId} />}

        <PostMenu
          userId={userId}
          _id={_id}
          image={image}
          body={body}
          path={path}
          bookmarkIsPending={bookmarkIsPending}
          bookmarkMutate={bookmarkMutate}
          isBookmarked={isBookmarked}
        />
      </div>

      {body && (
        <p
          dir="auto"
          className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-slate-800"
        >
          {body}
        </p>
      )}

      {sharedPost && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50">
          
          <div className="flex items-center gap-3 p-4 pb-2">
            <img
              src={sharedPost.user.photo}
              alt={sharedPost.user.name}
              onClick={() => {
                navigate(`/profile/${sharedPost.user._id}`)
              }}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white cursor-pointer"
            />
            <div className="min-w-0 flex-1">
              <p
                dir="auto"
                onClick={() => {
                navigate(`/profile/${sharedPost.user._id}`)
              }}
                className="truncate text-sm font-semibold text-slate-900 cursor-pointer hover:underline"
              >
                {sharedPost.user.name}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="truncate">@{sharedPost.user.username}</span>
                <span>·</span>
                <span>
                  {new Date(sharedPost.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* محتوى البوست الأصلي */}
          {sharedPost.body && (
            <Link to={`/postdetails/${sharedPost._id}`}>
              <p
                dir="auto"
                className="px-4 pb-3 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700"
              >
                {sharedPost.body}
              </p>
            </Link>
          )}

          {/* صورة البوست الأصلي */}
          {sharedPost.image && (
            <Link to={`/postdetails/${sharedPost._id}`}>
              <img
                src={sharedPost.image}
                alt="Shared post"
                loading="lazy"
                className="max-h-[22rem] w-full object-cover"
              />
            </Link>
          )}
        </div>
      )}

      {!sharedPost && image && (
        <img
          src={image}
          alt="Post"
          loading="lazy"
          className="mt-4 max-h-[28rem] w-full rounded-2xl object-cover ring-1 ring-slate-100"
        />
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => {
            setIsLikeOpen(true);
          }}
        >
          {likesCount} likes
        </button>
        <span className="flex gap-3">
          <Link to={`/postdetails/${_id}`}>{commentsCount} comments</Link>
          <span>{sharesCount} shares</span>
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            mutate();
          }}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition disabled:cursor-not-allowed  ${isLike ? "bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100" : "font-medium text-slate-600  hover:bg-indigo-50 hover:text-indigo-600"}`}
        >
          {isPending ? (
            <>
              <ImSpinner className="animate-spin" />
              Loading...
            </>
          ) : isLike ? (
            <>
              {" "}
              <FaHeart className="scale-110 fill-current text-lg" /> Liked
            </>
          ) : (
            <>
              {" "}
              <FiHeart className="text-lg" /> Like
            </>
          )}
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
          onClick={() => {
            setIsShareOpen(true);
          }}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiShare2 className="text-lg" />
          Share
        </button>

        <button
          type="button"
          disabled={bookmarkIsPending}
          onClick={() => bookmarkMutate()}
          className={`flex flex-1 cursor-pointer disabled:cursor-not-allowed items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition ${
            isBookmarked
              ? "bg-indigo-50 font-semibold text-indigo-600 hover:bg-indigo-100"
              : "font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          {bookmarkIsPending ? (
            <>
              <ImSpinner className="animate-spin" />
              Loading...
            </>
          ) : isBookmarked ? (
            <>
              <FaBookmark className="scale-110 fill-current text-lg" />
              Saved
            </>
          ) : (
            <>
              <FiBookmark className="text-lg" />
              Save
            </>
          )}
        </button>
      </div>

      <CommentInput
        postId={_id}
        isRefetch={isPostDetails ? ["getAllComments", _id] : ["getAllPosts"]}
      />

      {isPostDetails
        ? Data?.data.data.comments?.map((comment: CommentType) => (
            <TopComment
              key={comment._id}
              topComment={comment}
              isPostDetails={isPostDetails}
              postId={_id}
              userId={userId}
            />
          ))
        : topComment && (
            <TopComment
              topComment={topComment}
              isPostDetails={isPostDetails}
              postId={_id}
              userId={userId}
            />
          )}

      {isLikeOpen && (
        <LikesModal
          users={likesData?.data.data.likes || []}
          setIsLikeOpen={setIsLikeOpen}
          likesIsError={likesIsError}
          likesIsLoading={likesIsLoading}
          postID={_id}
        />
      )}

      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"
            onClick={() => setIsShareOpen(false)}
          />

          {/* Modal box */}
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-200/50 ring-1 ring-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">Share post</h3>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {/* Textarea */}
              <textarea
                placeholder="Write something about this post..."
                rows={3}
                ref={textInput}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

              {/* Preview of the post being shared */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-3 p-3">
                  <img
                    src={photo}
                    alt={name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      @{username}
                    </p>
                  </div>
                </div>

                {body && (
                  <p
                    dir="auto"
                    className="line-clamp-2 px-3 pb-3 text-xs leading-relaxed text-slate-600"
                  >
                    {body}
                  </p>
                )}

                {image && (
                  <img
                    src={image}
                    alt="Post preview"
                    className="max-h-32 w-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={shareIsPending}
                onClick={() => {
                  shareMutate();
                }}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-600 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700 flex items-center justify-center gap-1.5"
              >
                {shareIsPending ? (
                  <>
                    <ImSpinner className="animate-spin" /> Loading...
                  </>
                ) : (
                  "Share"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
