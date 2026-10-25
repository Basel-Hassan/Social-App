import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../Types/userProfile.type";
import Follow from "../Follow/Follow";
import FollowersCardError from "./FollowersCardError";
import FollowersCardSkeleton from "./FollowersCardSkeleton";

export default function FolloersCard({
  user
}: {
  user: string | UserType;
}) {
  const navigate = useNavigate();
  const userId = typeof user === "string" ? user : user._id;
  function getUserInfo() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getUserInfo", userId],
    queryFn: getUserInfo,
  });

  if (isLoading) {
    return <FollowersCardSkeleton />;
  }

  if (isError) {
    return (
      <FollowersCardError
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  const { name, photo, username } = data!.data.data.user;
  return (
    <li className="flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-indigo-50">
      <img
        src={photo}
        alt={name}
        onClick={() => {
          navigate(`/profile/${userId}`);
        }}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-indigo-100 cursor-pointer"
      />

      <div className="min-w-0 flex-1">
        <p
          dir="auto"
          className="truncate text-sm font-semibold text-slate-900 cursor-pointer hover:underline"
          onClick={() => {
            navigate(`/profile/${userId}`);
          }}
        >
          {name}
        </p>
        <p className="truncate text-xs text-slate-500">@{username}</p>
      </div>

      <Follow userId={userId} isBig={false} isSuggest={false} />
    </li>
  );
}
