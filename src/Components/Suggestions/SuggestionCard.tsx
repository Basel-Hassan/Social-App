import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Follow from "../Follow/Follow";

export interface SuggestionType {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number;
  followersCount: number;
}

export default function SuggestionCard({ user }: { user: SuggestionType }) {
  const { _id, name, username, photo, mutualFollowersCount, followersCount } = user;

  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center rounded-3xl bg-white p-5 text-center shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-100">
      {/* Avatar */}
      <img
        src={photo}
        alt={name}
        onClick={() => {
            navigate(`/profile/${_id}`)
        }}
        loading="lazy"
        className="h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-indigo-100 cursor-pointer"
      />

      {/* Name */}
      <div className="mt-3 w-full min-w-0">
        <h3
          dir="auto"
          onClick={() => {
            navigate(`/profile/${_id}`)
        }}
          className="truncate text-sm font-bold text-slate-900 sm:text-base cursor-pointer hover:underline"
        >
          {name}
        </h3>
        <p className="truncate text-xs text-slate-500">@{username}</p>
      </div>

      {/* Stats */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-600">
          <FiUsers className="text-sm" />
          {mutualFollowersCount} mutual
        </span>
        <span>{followersCount} followers</span>
      </div>

      {/* Follow */}
        <Follow userId={_id} isBig={true} isSuggest={true}/>
      </div>
  );
}