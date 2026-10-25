import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRef, useState } from "react";
import {
  FiBookmark,
  FiCalendar,
  FiCamera,
  FiImage,
  FiUsers,
} from "react-icons/fi";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import Follow from "../Follow/Follow";
import { useNavigate } from "react-router-dom";
import FollowersModal from "../Followers/FollowersModal";

export default function ProfileInfo({
  userId,
  cover,
  photo,
  name,
  username,
  createdAt,
  dateOfBirth,
  followersCount,
  followingCount,
  bookmarksCount,
  isMyProfile,
  following,
  followers
}: {
  userId: string;
  cover?: string;
  photo: string;
  name: string;
  username: string;
  createdAt: string;
  dateOfBirth: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  isMyProfile: boolean;
  following:string[];
  followers:string[];
}) {
  const Query = useQueryClient();
  const photoInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const formData = new FormData();
  const coverFormData = new FormData();
  const navigate = useNavigate()
  const [isFollowersOpen, setIsFollowersOpen] = useState(false)
  const [isFollowingOpen, setIsFollowingOpen] = useState(false)

  function uploadProfilePhotoApi(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate } = useMutation<
    AxiosResponse<{ message?: string }>,
    AxiosError<{ message?: string }>,
    FormData
  >({
    mutationFn: uploadProfilePhotoApi,
  });

  function handleUploadPhoto() {
    const photo = photoInput.current?.files?.[0];

    if (!photo) return;

    if (photo) formData.append("photo", photo);

    const toastId = toast.loading("Uploading profile photo...");
    mutate(formData, {
      onSuccess: (res) => {
        toast.success(res.data.message ?? "Photo uploaded successfully", {
          id: toastId,
        });
        Query.invalidateQueries({ queryKey: ["myProfileApi"] });
        Query.invalidateQueries({ queryKey: ["userPostsApi"] });
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || err.message || "Something went wrong",
          { id: toastId },
        );
      },
    });
  }

  function uploadProfileCoverApi(coverFormData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/users/upload-cover`,
      coverFormData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: coverMutate } = useMutation<
    AxiosResponse<{ message?: string }>,
    AxiosError<{ message?: string }>,
    FormData
  >({
    mutationFn: uploadProfileCoverApi,
  });

  function handleUploadCover() {
    const photo = coverInput.current?.files?.[0];

    if (!photo) return;

    if (photo) coverFormData.append("cover", photo);

    const toastId = toast.loading("Uploading profile cover...");
    coverMutate(coverFormData, {
      onSuccess: (res) => {
        toast.success(res.data.message ?? "Cover uploaded successfully", {
          id: toastId,
        });
        Query.invalidateQueries({ queryKey: ["myProfileApi"] });
        Query.invalidateQueries({ queryKey: ["userPostsApi"] });
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || err.message || "Something went wrong",
          { id: toastId },
        );
      },
    });
  }
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 mb-7">
      <div className="relative h-36 bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-300 sm:h-44">
        {cover ? (
          <img src={cover} alt="Cover" className="h-full w-full object-cover" />
        ) : null}

        {isMyProfile && (
          <label
            aria-label="Update cover image"
            className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-full bg-slate-900/60 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-slate-900/80 hover:scale-105 active:scale-95 focus-within:ring-4 focus-within:ring-white/40 z-10"
          >
            <FiImage className="text-sm sm:text-base" />
            <span className="hidden sm:inline">
              {cover ? "Change cover" : "Add cover"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverInput}
              onChange={handleUploadCover}
            />
          </label>
        )}
      </div>

      <div className="relative px-5 pb-6 sm:px-6">
        <div className="-mt-12 mb-4 flex items-end justify-between sm:-mt-14">
          <div className="relative group">
            <img
              src={photo}
              alt={name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg sm:h-28 sm:w-28"
            />
            {isMyProfile && (
              <label className="absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md ring-2 ring-white transition-all hover:bg-indigo-600 hover:scale-105 active:scale-95 sm:h-9 sm:w-9 cursor-pointer">
                <FiCamera className="text-sm sm:text-base" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={photoInput}
                  onChange={handleUploadPhoto}
                />
              </label>
            )}
          </div>
          {!isMyProfile && <Follow userId={userId} isBig={true} isSuggest={false}/>}
        </div>

        <div>
          <h1
            dir="auto"
            className="text-xl font-bold text-slate-900 sm:text-2xl"
          >
            {name}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">@{username}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="text-sm" />
            Joined{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          {dateOfBirth && (
            <span className="flex items-center gap-1.5">
              <FiCalendar className="text-sm" />
              Born{" "}
              {new Date(dateOfBirth).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-6 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsFollowersOpen(true)
            }}
            className="group flex flex-col items-start transition cursor-pointer"
          >
            <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">
              {followersCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <FiUsers className="text-sm" />
              Followers
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFollowingOpen(true)
            }}
            className="group flex flex-col items-start transition cursor-pointer"
          >
            <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">
              {followingCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <FiUsers className="text-sm" />
              Following
            </span>
          </button>

          {isMyProfile && (
            <button
              type="button"
              onClick={() => {
                navigate("/bookmarks")
              }}
              className="group flex flex-col items-start transition cursor-pointer"
            >
              <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">
                {bookmarksCount}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <FiBookmark className="text-sm" />
                Bookmarks
              </span>
            </button>
          )}
        </div>
      </div>
      {isFollowersOpen && <FollowersModal users={followers} closeFn={setIsFollowersOpen}/>}
      {isFollowingOpen && <FollowersModal users={following} closeFn={setIsFollowingOpen}/>}
      
    </div>
  );
}
