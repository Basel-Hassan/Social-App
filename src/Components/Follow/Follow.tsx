import { useContext, useEffect, useState } from "react";
import { FiUserCheck, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { ProfileContext } from "../../Context/ProfileContext";
import axios, { AxiosError } from "axios";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function Follow({ userId , isBig = false , isSuggest}: { userId: string , isBig:boolean , isSuggest:boolean}) {
  const query = useQueryClient();
  const { id } = useParams();
  const profileContext = useContext(ProfileContext);

  if (!profileContext) {
    throw new Error("PostCard must be used inside ProfileContextProvider");
  }

  const { user: profileUser } = profileContext;
  const following = profileUser?.following;

  const [isFollow, setIsFollow] = useState(following?.includes(userId));

  useEffect(() => {
    setIsFollow(following?.includes(userId) ?? false);
  }, [following, userId]);

  function doFollow() {
    return axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: followMutate, isPending: followIsPending } = useMutation({
    mutationFn: doFollow,
    onSuccess: (res) => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["userPostsApi"] });
      query.invalidateQueries({ queryKey: ["myProfileApi"] });
      query.invalidateQueries({ queryKey: ["getUserProfile", userId] });
      query.invalidateQueries({ queryKey: ["getSinglePost", id] });
      toast.success(res.data.message);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data.message || err.message || "Something went wrong",
      );
    },
  });
  return (
    <>
      {isFollow ? (
        <button
          type="button"
          disabled={followIsPending}
          onClick={() => {
            followMutate();
          }}
          className={`group flex cursor-pointer items-center bg-indigo-50 font-semibold text-indigo-600 transition hover:bg-red-50 ring-1 ring-indigo-100   hover:text-red-600 hover:ring-red-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 ${isBig ? "justify-center gap-2 rounded-xl py-2.5 px-4 text-sm" : "shrink-0 gap-1.5 rounded-full  px-3.5 py-1.5 text-xs"} ${isSuggest && "w-full mt-4"}`}
        >
          {followIsPending ? (
            <>
              <ImSpinner className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <FiUserCheck className="text-sm group-hover:hidden" />
              <FiUserMinus className="hidden text-sm group-hover:block" />

              <span className="hidden sm:inline group-hover:sm:hidden">
                Following
              </span>
              <span className="hidden group-hover:sm:inline">Unfollow</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled={followIsPending}
          onClick={() => {
            followMutate();
          }}
          className={`flex cursor-pointer items-center bg-indigo-600 font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 ${isBig ? "justify-center gap-2 rounded-xl py-2.5 px-4 text-sm" : "shrink-0 gap-1.5 rounded-full  px-3.5 py-1.5 text-xs"} ${isSuggest && "w-full mt-4"}`}
        >
          {followIsPending ? (
            <>
              <ImSpinner className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <FiUserPlus className="text-sm" />
              <span className="hidden sm:inline">Follow</span>
            </>
          )}
        </button>
      )}
    </>
  );
}
