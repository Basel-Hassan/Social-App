import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  FiEdit2,
  FiImage,
  FiMoreHorizontal,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import { ImSpinner } from "react-icons/im";

const itemClass =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition";

export default function CommentMenu({
  commentID,
  content,
  postId,
  image,
  userId
}: {
  commentID: string;
  content: string;
  postId: string;
  image: string | undefined;
  userId:string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const query = useQueryClient();
  const textInput = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [isUploaded, setIsUploaded] = useState(image ?? "");
  const [, setIsImageRemoved] = useState(false);

  useEffect(() => {
    if (isEditOpen) {
      setIsUploaded(image ?? "");
      setIsImageRemoved(false);
    }
  }, [isEditOpen, image]);

  function deleteCommentApi() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentID}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllComments", postId] });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["userPostsApi"] });
      query.invalidateQueries({ queryKey: ["getBookMarks"] });
      setIsDeleteOpen(false);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    },
  });

  function uploadImg(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploaded(URL.createObjectURL(file));
    setIsImageRemoved(false);
  }

  function removeImg() {
    setIsUploaded("");
    setIsImageRemoved(true);

    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }

  function editCommentApi(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentID}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: editCommentMutate, isPending: editCommentIsPending } =
    useMutation({
      mutationFn: editCommentApi,

      onSuccess: (res) => {
        query.invalidateQueries({
          queryKey: ["getAllPosts"],
        });

        query.invalidateQueries({
          queryKey: ["getBookMarks"],
        });

        query.invalidateQueries({
          queryKey: ["getSinglePost", postId],
        });

        query.invalidateQueries({
          queryKey: ["getAllComments", postId],
        });

        query.invalidateQueries({
          queryKey: ["userPostsApi" , userId],
        });

        toast.success(res.data.message || "Comment updated successfully");

        setIsEditOpen(false);
      },

      onError: (err: AxiosError<{ message?: string }>) => {
        toast.error(
          err.response?.data?.message || err.message || "Something went wrong",
        );
      },
    });

  function handleUpdateComment() {
    const newBody = textInput.current?.value.trim() ?? "";
    const file = imageInput.current?.files?.[0];

    if (!newBody && !isUploaded && !file) {
      toast.error("Please enter a comment or add an image");
      return;
    }

    const formData = new FormData();

    formData.append("content", newBody);

    if (file) {
      formData.append("image", file);
    }

    editCommentMutate(formData);
  }

  return (
    <>
      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="Comment options"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center
            rounded-full text-lg transition
            ${
              isOpen
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            }`}
        >
          <FiMoreHorizontal />
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              aria-label="Close comment menu"
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setIsOpen(false)}
            />

            <div
              role="menu"
              className="absolute right-0 top-full z-30 mt-2 w-56
                origin-top-right rounded-2xl border border-slate-100
                bg-white p-1.5 shadow-xl shadow-slate-200/60
                ring-1 ring-slate-100"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsEditOpen(true);
                  setIsOpen(false);
                }}
                className={`${itemClass} text-slate-700 hover:bg-indigo-50 hover:text-indigo-600`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FiEdit2 className="text-base" />
                </span>

                <span className="flex-1">Edit comment</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsDeleteOpen(true);
                  setIsOpen(false);
                }}
                className={`${itemClass} text-red-600 hover:bg-red-50`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <FiTrash2 className="text-base" />
                </span>

                <span className="flex-1">Delete comment</span>
              </button>
            </div>
          </>
        )}
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close edit dialog"
            onClick={() => {
              setIsEditOpen(false);
            }}
            className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-comment-title"
            className="relative w-full max-w-lg overflow-hidden rounded-3xl
              bg-white shadow-2xl shadow-slate-950/20"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="edit-comment-title"
                  className="text-base font-bold text-slate-900"
                >
                  Edit comment
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update your thoughts
                </p>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsEditOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="p-5 sm:p-6 sm:pb-0 pb-0">
              <label
                htmlFor="edit-comment-content"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Your comment
              </label>

              <textarea
                id="edit-comment-content"
                defaultValue={content}
                ref={textInput}
                rows={4}
                placeholder="Write your comment..."
                className="w-full rounded-2xl border border-slate-200
                  bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-800
                  outline-none transition placeholder:text-slate-400
                  focus:border-indigo-400 focus:bg-white focus:ring-4
                  focus:ring-indigo-100 resize-none"
              />
            </div>

            {isUploaded && (
              <div className="p-5">
                <div className="relative mt-4 w-full">
                  <img
                    src={isUploaded}
                    alt="Current"
                    className="max-h-64 w-full rounded-2xl object-cover ring-1 ring-slate-200"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      removeImg();
                    }}
                    aria-label="Remove image"
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900/70 text-base text-white backdrop-blur transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
              <label
                aria-label="Change image"
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                <FiImage className="text-lg" />
                Change photo
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={imageInput}
                  onChange={uploadImg}
                />
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200/70"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={editCommentIsPending}
                  onClick={() => {
                    handleUpdateComment();
                  }}
                  className="cursor-pointer rounded-xl flex items-center justify-center gap-2 bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-700"
                >
                  {editCommentIsPending ? (
                    <>
                      <ImSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save changes{" "}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete dialog"
            onClick={() => setIsDeleteOpen(false)}
            className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-sm"
          />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-comment-title"
            className="relative w-full max-w-sm rounded-3xl bg-white p-5
              shadow-2xl shadow-slate-950/20 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-500 ring-4 ring-red-50/60">
                <FiTrash2 />
              </span>

              <div className="min-w-0 flex-1 pt-1">
                <h2
                  id="delete-comment-title"
                  className="text-base font-bold text-slate-900"
                >
                  Delete this comment?
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Are you sure you want to delete this comment? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  mutate();
                }}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-700"
              >
                {isPending ? (
                  <>
                    <ImSpinner className="animate-spin" /> Loading...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete comment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
