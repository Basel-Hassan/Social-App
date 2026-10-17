import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState, type ChangeEvent } from "react";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import toast from "./../../../node_modules/react-hot-toast/src/index";

export default function CreatePost() {
  const formData = new FormData();
  const [isUploaded, setIsUploaded] = useState("");
  const textInput = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const query = useQueryClient();

  function uploadImg(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploaded(URL.createObjectURL(file));
  }

  function createPostApi() {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  function clearForm() {
    if (textInput.current) textInput.current.value = "";
    if (imageInput.current) imageInput.current.value = "";
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createPostApi,
    onSuccess: (res) => {
      clearForm();
      setIsUploaded("");
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success(res.data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleCreatePost() {
    const body = textInput.current?.value.trim();
    const file = imageInput.current?.files?.[0];
    if (!body && !file) return;

    if (body) formData.append("body", body);
    if (file) formData.append("image", file);

    mutate();
  }
  return (
    <div className="w-full max-w-xl mb-7 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
      {/* Header + text */}
      <div className="flex items-start gap-3">
        <textarea
          name="body"
          dir="auto"
          ref={textInput}
          rows={3}
          placeholder="What's on your mind?"
          className="min-h-[5rem] w-full flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {isUploaded && (
        <div className="relative mt-4 w-full">
          <img
            src={isUploaded}
            alt="Selected"
            className="max-h-72 w-full rounded-2xl object-cover ring-1 ring-slate-200"
          />

          <button
            type="button"
            onClick={() => {
              setIsUploaded("");
              if (imageInput.current) imageInput.current.value = "";
            }}
            aria-label="Remove image"
            className="absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900/70 text-base text-white backdrop-blur transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        {/* Image picker */}
        <label
          aria-label="Add image"
          className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiImage className="text-lg" />
          Photo
          <input
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadImg}
            ref={imageInput}
          />
        </label>

        {/* Submit */}
        <button
          type="button"
          disabled={isPending}
          className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-700"
          onClick={() => {
            handleCreatePost();
          }}
        >
          {isPending ? (
            <>
              <ImSpinner className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Post
              <FiSend className="transition group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
