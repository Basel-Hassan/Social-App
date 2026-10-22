import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useContext, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import {
  FiBookmark,
  FiEdit2,
  FiLink,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../Context/LoginContext";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import EditPostModal from "./EditPostModal";

const itemClass =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition";

export default function PostMenu({
  userId,
  _id,
  body,
  image,
  path,
  bookmarkIsPending,
  bookmarkMutate,
  isBookmarked,
}: {
  userId: string;
  _id: string;
  body: string | undefined;
  image: string | undefined;
  path: string;
  bookmarkIsPending: boolean;
  bookmarkMutate: UseMutateFunction<
    AxiosResponse<any>,
    AxiosError<{ message?: string }>,
    void,
    unknown
  >;
  isBookmarked: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { userId: myId } = useContext(LoginContext);
  const query = useQueryClient();
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    const postUrl = `${window.location.origin}/postdetails/${_id}`;

    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  function handleDeletPost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate } = useMutation({
    mutationFn: handleDeletPost,
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["userPostsApi"] });
      navigate(path);
    },
  });

  function confirmDeletePost() {
    toast.custom(
      (t) => (
        <div
          role="alertdialog"
          aria-labelledby="delete-title"
          className={`w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 transition duration-200 ${
            t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-500 ring-4 ring-red-50/60">
              <FiTrash2 />
            </span>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <h3
                id="delete-title"
                className="text-sm font-bold text-slate-900"
              >
                Delete this post?
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                This action can't be undone. The post and its comments will be
                removed permanently.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                mutate();
                toast.dismiss(t.id);
              }}
              className="cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  }

  return (
    <div className="relative outline-none">
      <button
        type="button"
        aria-label="More options"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        aria-haspopup="menu"
        className={`cursor-pointer rounded-full p-2 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 ${isOpen && "text-slate-600 bg-slate-100"}`}
      >
        <FiMoreHorizontal />
      </button>
        
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-52 origin-top-right scale-95 rounded-2xl bg-white p-1.5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 transition "
        >
          {userId === myId && (
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-slate-700 hover:bg-indigo-50 hover:text-indigo-600`}
              onClick={() => {
                setIsEditOpen(true);
                setIsOpen(false);
              }}
            >
              <FiEdit2 className="text-base" />
              Edit post
            </button>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              bookmarkMutate();
              setIsOpen(false);
            }}
            disabled={bookmarkIsPending}
            className={`${itemClass} text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed ${isBookmarked && "bg-indigo-50 font-semibold text-indigo-600 hover:bg-indigo-100"}`}
          >
            {bookmarkIsPending ? (
              <>
                <ImSpinner className="animate-spin" />
                Loading...
              </>
            ) : isBookmarked ? (
              <>
                <FaBookmark className="scale-110 fill-current text-lg" />
                Saved post
              </>
            ) : (
              <>
                <FiBookmark className="text-lg" />
                Save post
              </>
            )}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              handleCopyLink();
              setIsOpen(false);
            }}
            className={`${itemClass} text-slate-700 hover:bg-indigo-50 hover:text-indigo-600`}
          >
            <FiLink className="text-base" />
            Copy link
          </button>

          {userId === myId && (
            <>
              <hr className="my-1.5 border-slate-100" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  confirmDeletePost();
                  setIsOpen(false);
                }}
                className={`${itemClass} text-red-600 hover:bg-red-50`}
              >
                <FiTrash2 className="text-base" />
                Delete post
              </button>
            </>
          )}
        </div>
      )}

      {isEditOpen && (
        <EditPostModal
          setIsEditOpen={setIsEditOpen}
          _id={_id}
          image={image}
          body={body}
        />
      )}
    </div>
  );
}
