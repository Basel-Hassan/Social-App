import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import { ImSpinner } from "react-icons/im";

export default function InputReplyComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const textInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const formData = new FormData();
  const query = useQueryClient();
  const [isUploaded, setIsUploaded] = useState("");

  function clearForm() {
    if (textInput.current) textInput.current.value = "";
    if (imageInput.current) imageInput.current.value = "";
  }

  function doReplyApi() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: doReplyApi,
    onSuccess: (res) => {
      query.invalidateQueries({ queryKey: ["getAllComments", postId] });
      query.invalidateQueries({ queryKey: ["getReplies", commentId] });
      toast.success(res.data.message);
      clearForm();
      setIsUploaded("");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    },
  });

  function handleDoReply() {
    const content = textInput.current?.value;
    const image = imageInput.current?.files?.[0];
    if (!content && !image) return;
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);

    mutate();
  }

  return (
    <div className="mt-3 ml-1">
      {isUploaded && (
        <div className="relative mb-2 w-fit">
          <img
            src={isUploaded}
            alt="Selected"
            className="h-28 max-w-full rounded-2xl object-cover ring-1 ring-slate-200"
          />

          <button
            type="button"
            aria-label="Remove image"
            onClick={() => {
              setIsUploaded("");
              if (imageInput.current) {
                imageInput.current.value = "";
              }
            }}
            className="absolute right-1.5 top-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-900/70 text-sm text-white backdrop-blur transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            <FiX />
          </button>
        </div>
      )}

      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-1.5 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
        <input
          type="text"
          dir="auto"
          ref={textInput}
          placeholder="Write a reply..."
          className="min-w-0 flex-1 bg-transparent p-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
        />

        <label className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-base text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600">
          <FiImage />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInput}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                const path = URL.createObjectURL(file);
                setIsUploaded(path);
              }
            }}
          />
        </label>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            handleDoReply();
          }}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-sm text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          {isPending ? <ImSpinner className="animate-spin" /> : <FiSend />}
        </button>
      </div>
    </div>
  );
}
