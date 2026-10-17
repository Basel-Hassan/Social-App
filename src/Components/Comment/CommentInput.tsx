import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { useRef, useState } from "react";
import toast from "./../../../node_modules/react-hot-toast/src/index";

export default function CommentInput({
  postId,
  isRefetch,
}: {
  postId: string;
  isRefetch: string[];
}) {
  const [isUploaded, setIsUploaded] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);

  const formData = new FormData();

  const query = useQueryClient();

  const form = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  function createCommentApi() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createCommentApi,
    onSuccess: (res) => {
      query.invalidateQueries({
        queryKey: isRefetch,
      });
      reset();
      setIsUploaded("");
      toast.success(res.data.message);
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  function createComment(value: { content: string; image: string }) {
    if (!value.content && !value.image?.[0]) {
      return;
    }

    if (value.content) {
      formData.append("content", value.content);
    }
    if (value.image?.[0]) {
      formData.append("image", value.image?.[0]);
    }

    mutate();
  }
  return (
    <div className="mt-4 flex items-end gap-3">
      {/* Avatar (replace with the user's photo later) */}

      <div className="min-w-0 flex-1">
        {/* Image preview */}
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

        {/* Input box */}
        <form
          onSubmit={handleSubmit(createComment)}
          className="flex min-w-0 flex-1 items-center gap-1 rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-1.5 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
        >
          <input
            type="text"
            {...register("content")}
            dir="auto"
            placeholder="Write a comment..."
            className="min-w-0 flex-1 bg-transparent p-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl"
          />

          {/* Image picker */}
          <label
            aria-label="Add image"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <FiImage />
            <input
              {...register("image", {
                onChange: (e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    const path = URL.createObjectURL(file);
                    setIsUploaded(path);
                  }
                },
              })}
              ref={(e) => {
                register("image").ref(e);
                imageInput.current = e;
              }}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>

          {/* Send */}
          <button
            type="submit"
            disabled={isPending}
            aria-label="Send comment"
            className="flex h-9 w-9 disabled:cursor-not-allowed shrink-0 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-base text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:bg-gray-700"
          >
            {isPending ? <ImSpinner className="animate-spin" /> : <FiSend />}
          </button>
        </form>
      </div>
    </div>
  );
}
