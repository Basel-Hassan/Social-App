import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {
  FiArrowRight,
  FiBell,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiUserPlus,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { NotificationType } from "../../Types/Notfication.type";

export default function NotficationList({
  notficationData,
  setIsNotficationOpen,
}: {
  notficationData: NotificationType;
  setIsNotficationOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const query = useQueryClient()
  const { _id, actor, type, createdAt, isRead, entityId, entity, entityType } =
  notficationData;
  const { name, photo } = actor;


  function handleNotficationData(type: string) {
    if (type === "comment_post") {
      return {
        icon: <FiMessageCircle />,
        iconClass: "bg-indigo-600",
        text: "commented on your post",
      };
    } else if (type === "like_post") {
      return {
        icon: <FiHeart />,
        iconClass: "bg-rose-500",
        text: "liked your post",
      };
    } else if (type === "follow_user") {
      return {
        icon: <FiUserPlus />,
        iconClass: "bg-emerald-500",
        text: "started following you",
      };
    } else if (type === "share_post") {
      return {
        icon: <FiShare2 />,
        iconClass: "bg-sky-500",
        text: "shared your post",
      };
    } else {
      return {
        icon: <FiBell />,
        iconClass: "bg-slate-500",
        text: "sent you a notification",
      };
    }
  }

  function handleTime(createdAt: string) {
    const currentDate = new Date();
    const notficationDate = new Date(createdAt);
    const currentDateObj = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      second: currentDate.getSeconds(),
    };

    const notficationDateObj = {
      year: notficationDate.getFullYear(),
      month: notficationDate.getMonth() + 1,
      day: notficationDate.getDate(),
      hour: notficationDate.getHours(),
      minute: notficationDate.getMinutes(),
      second: notficationDate.getSeconds(),
    };

    if (currentDateObj.year - notficationDateObj.year > 0) {
      return `${currentDateObj.year - notficationDateObj.year} year${currentDateObj.year - notficationDateObj.year > 1 ? "s" : ""} ago`;
    } else if (currentDateObj.month - notficationDateObj.month > 0) {
      return `${currentDateObj.month - notficationDateObj.month} month${currentDateObj.month - notficationDateObj.month > 1 ? "s" : ""} ago`;
    } else if (currentDateObj.day - notficationDateObj.day > 0) {
      return `${currentDateObj.day - notficationDateObj.day} day${currentDateObj.day - notficationDateObj.day > 1 ? "s" : ""} ago`;
    } else if (currentDateObj.hour - notficationDateObj.hour > 0) {
      return `${currentDateObj.hour - notficationDateObj.hour} hour${currentDateObj.hour - notficationDateObj.hour > 1 ? "s" : ""} ago`;
    } else if (currentDateObj.minute - notficationDateObj.minute > 0) {
      return `${currentDateObj.minute - notficationDateObj.minute} minute${currentDateObj.minute - notficationDateObj.minute > 1 ? "s" : ""} ago`;
    } else if (currentDateObj.second - notficationDateObj.second > 0) {
      return `${currentDateObj.second - notficationDateObj.second} second${currentDateObj.second - notficationDateObj.second > 1 ? "s" : ""} ago`;
    } else {
      return `just now`;
    }
  }

  function markNotficationApi() {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/${_id}/read`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const {mutate} = useMutation({
    mutationFn:markNotficationApi , 
    onSuccess: () => {
      query.invalidateQueries({queryKey:["getNotfications"]})
      query.invalidateQueries({queryKey:["getNotficationCount"]})
    }
  })

  return (
    <>
      <li
        onClick={() => {
          mutate()
        }}
        className={`flex items-start gap-3 cursor-pointer rounded-2xl p-3 transition hover:bg-indigo-50 ${
          isRead ? "bg-indigo-50/60" : ""
        }`}
      >
        {/* Avatar + type icon */}
        <div className="relative shrink-0">
          <img
            src={photo}
            alt={name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-100 sm:h-11 sm:w-11"
          />
          <span
            className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white ring-2 ring-white ${handleNotficationData(type).iconClass}`}
          >
            {handleNotficationData(type).icon}
          </span>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm text-slate-700">
                <span className="font-semibold text-slate-900">{name}</span>{" "}
                {handleNotficationData(type).text}
              </p>
              <p
                className={`mt-0.5 text-xs ${
                  isRead ? "font-semibold text-indigo-600" : "text-slate-400"
                }`}
              >
                {handleTime(createdAt)}
              </p>
            </div>

            {/* Unread dot */}
            {!isRead && (
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
            )}
          </div>

          {!entity?.unavailable && !(entityType === "user") && (
            <Link
              onClick={() => {
                setIsNotficationOpen(false);
              }}
              to={`/postdetails/${entity?.post || entity?.topComment?.post || entityId}`}
              className="group mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-600 hover:text-white hover:ring-indigo-600"
            >
              View post
              <FiArrowRight className="transition group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </li>
    </>
  );
}
