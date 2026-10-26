import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { LoginContext } from "../../Context/LoginContext";
import type { CommentType } from "../../Types/Coment.type";
import InputReplyComment from "./InputReplyComment";
import RepliesComments from "./RepliesComments";
import RepliesSkeleton from "./RepliesSkeleton";
import RepliesError from "./RepliesError";
import CommentMenu from "./CommentMenu";
import { useNavigate } from "react-router-dom";

export default function TopComment({
  topComment,
  isPostDetails,
  postId,
  userId
}: {
  topComment: CommentType;
  isPostDetails: boolean;
  postId: string;
  userId:string
}) {
  const {
    content,
    commentCreator,
    createdAt,
    image,
    _id,
    repliesCount,
    likes,
  } = topComment;
  const { name, photo, _id: commentCreatorID } = commentCreator;
  const { userId: myId } = useContext(LoginContext);
  const isLike = likes?.includes(myId) ?? false;
  const query = useQueryClient();
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const isReply = repliesCount > 0;
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const isOwner = commentCreatorID === myId;
  const navigate = useNavigate();

  function doLikeApi() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}/like`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: doLikeApi,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllComments", postId] });
    },
  });

  function getRepliesApi() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}/replies`,
      {
        params: {
          page: 1,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["getReplies", _id],
    queryFn: getRepliesApi,
  });
  const replies: CommentType[] = data?.data?.data?.replies ?? [];

  return (
    <div className="mt-4">
      <div className="flex items-start gap-3">
        <img
          src={photo}
          alt={name}
          onClick={() => {
            navigate(`/profile/${commentCreatorID}`);
          }}
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-indigo-100 cursor-pointer"
        />

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p
                  dir="auto"
                  className="text-xs font-semibold text-slate-900 cursor-pointer hover:underline"
                  onClick={() => {
                    navigate(`/profile/${commentCreatorID}`);
                  }}
                >
                  {name}
                </p>

                <p
                  dir="auto"
                  className="mt-0.5 break-words text-sm text-slate-700"
                >
                  {content}
                </p>
              </div>

              {isOwner && (
                <CommentMenu
                  commentID={_id}
                  content={content}
                  postId={postId}
                  image={image}
                  userId={userId}
                />
              )}
            </div>

            {image && (
              <img
                src={image}
                alt="Comment"
                loading="lazy"
                className="mt-2 max-h-48 rounded-xl object-cover"
              />
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-3 px-2">
            {isPostDetails ? (
              <>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    mutate();
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-rose-500 cursor-pointer disabled:cursor-not-allowed "
                >
                  {isPending ? (
                    <>
                      <ImSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : isLike ? (
                    <>
                      {" "}
                      <FaHeart className="scale-110 fill-current text-sm" />{" "}
                      Liked
                    </>
                  ) : (
                    <>
                      {" "}
                      <FiHeart className="text-sm" /> Like
                    </>
                  )}
                  <span className="text-slate-400">{likes.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsReplyInputOpen(!isReplyInputOpen);
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-indigo-600 cursor-pointer"
                >
                  <FiMessageCircle className="text-sm" />
                  Reply
                </button>
              </>
            ) : (
              ""
            )}

            <span className="text-xs text-slate-400">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          {isReplyInputOpen && (
            <InputReplyComment postId={postId} commentId={_id} />
          )}

          {isReply ? (
            <button
              type="button"
              onClick={() => {
                setIsRepliesOpen(!isRepliesOpen);
              }}
              className="mt-2 flex items-center gap-1.5 px-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 cursor-pointer"
            >
              {isRepliesOpen ? "Hide replies" : `View ${repliesCount} replies`}
            </button>
          ) : (
            ""
          )}

          {isReply &&
            isRepliesOpen &&
            (isLoading ? (
              <RepliesSkeleton count={Math.min(repliesCount, 3)} />
            ) : isError ? (
              <RepliesError
                message={
                  (error as AxiosError<{ message?: string }>)?.response?.data
                    ?.message || error.message
                }
                onRetry={() => refetch()}
              />
            ) : (
              replies.map((reply) => (
                <RepliesComments key={reply._id} replyData={reply} />
              ))
            ))}
        </div>
      </div>
    </div>
  );
}
