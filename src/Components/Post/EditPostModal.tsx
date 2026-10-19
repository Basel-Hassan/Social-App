import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { FiEdit2, FiImage, FiSave, FiX } from "react-icons/fi";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import { ImSpinner } from "react-icons/im";
import { useParams } from "react-router-dom";

export default function EditPostModal({
  setIsEditOpen,
  _id,
  body,
  image,
}: {
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  _id: string;
  body: string | undefined;
  image: string | undefined;
}) {
  const textInput = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [isUploaded, setIsUploaded] = useState(image ?? "");
  const formData = new FormData();
  const query = useQueryClient();
  const { id } = useParams();

  function uploadImg(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploaded(URL.createObjectURL(file));
  }

  function removeImg() {
    setIsUploaded("");
    if (imageInput.current) imageInput.current.value = "";
  }

  function updatePostApi() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updatePostApi,
    onSuccess: (res) => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost", id] });
      query.invalidateQueries({ queryKey: ["myProfileApi"] });
      toast.success(res.data.message);
      setIsEditOpen(false);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    },
  });

  function handleUpdatePost() {
    const newBody = textInput.current?.value.trim() || " ";
    const file = imageInput.current?.files?.[0] || " ";
    if (!newBody && !isUploaded) return;

    formData.append("body", newBody || " ");
    formData.append("image", file || " ");

    mutate();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-post-title"
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-100 sm:p-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">
            <FiEdit2 />
          </span>

          <div className="min-w-0 flex-1">
            <h2
              id="edit-post-title"
              className="text-lg font-bold text-slate-900"
            >
              Edit post
            </h2>
            <p className="text-xs text-slate-500">
              Update your text or change the photo.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              setIsEditOpen(false);
            }}
            className="cursor-pointer rounded-full p-2 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX />
          </button>
        </div>

        {/* Text */}
        <textarea
          name="body"
          dir="auto"
          rows={4}
          ref={textInput}
          placeholder="What's on your mind?"
          defaultValue={body ? body : ""}
          className="min-h-[7rem] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />

        {isUploaded && (
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
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {/* Image picker */}
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
              className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancel
            </button>

            <button
              disabled={isPending}
              type="button"
              onClick={() => {
                handleUpdatePost();
              }}
              className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-700"
            >
              {isPending ? (
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
  );
}
