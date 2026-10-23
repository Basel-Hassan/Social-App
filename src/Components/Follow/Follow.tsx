import { useContext, useEffect, useState } from "react";
import { FiUserCheck, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { ProfileContext } from "../../Context/ProfileContext";
import axios, { AxiosError } from "axios";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function Follow({ userId }: { userId: string }) {
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
      query.invalidateQueries({ queryKey: ["getUserProfile" , userId] });
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
          className="group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-red-50 hover:text-red-600 hover:ring-red-200 focus:outline-none focus:ring-4 focus:ring-indigo-100"
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
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
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
