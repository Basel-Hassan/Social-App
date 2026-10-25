import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiUserPlus } from "react-icons/fi";
import { UserType } from "../../Types/userProfile.type";
import FollowersCardSkeleton from "./FollowersCardSkeleton";
import FollowersCardError from "./FollowersCardError";
import Follow from "../Follow/Follow";
import { useNavigate } from "react-router-dom";

export default function FolloersCard({
  user,
  isMyProfile,
}: {
  user: string | UserType;
  isMyProfile: boolean;
}) {
    const navigate = useNavigate()
  function getUserInfo() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${isMyProfile ? user : user._id}/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data , isLoading , isError , refetch } = useQuery({
    queryKey: ["getUserInfo", isMyProfile ? user : user._id],
    queryFn: getUserInfo,
  });

  if (isLoading) {
    return <FollowersCardSkeleton/>
  }

  if (isError) {
    return <FollowersCardError onRetry={() => {
        refetch()
    }}/>
  }

const {name , photo ,username} = data!.data.data.user 
  return (
    <li className="flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-indigo-50">
      <img
        src={photo}
        alt={name}
        onClick={() => {
            navigate(`/profile/${isMyProfile ? user : user._id}`)
        }}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-indigo-100 cursor-pointer"
      />

      <div className="min-w-0 flex-1">
        <p dir="auto" className="truncate text-sm font-semibold text-slate-900 cursor-pointer hover:underline" onClick={() => {
            navigate(`/profile/${isMyProfile ? user : user._id}`)
        }}>
          {name}
        </p>
        <p className="truncate text-xs text-slate-500">@{username}</p>
      </div>

        <Follow userId={isMyProfile ? user : user._id} isBig={false} isSuggest={false}/>
    </li>
  );
}
