import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { FiCheck } from "react-icons/fi";
import { NotificationType } from "../../Types/Notfication.type";
import NotficationList from "./NotficationList";
import NotificationSkeleton from "./NotificationSkeleton";
import NotficationError from "./NotficationError";
import NotificationEmpty from "./NotificationEmpty";

export default function Notification({
  unreadNotficationCount,
  setIsNotficationOpen,
}: {
  unreadNotficationCount: number;
  setIsNotficationOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const query = useQueryClient();

  function notficationsApi() {
    return axios.get(`https://route-posts.routemisr.com/notifications`, {
      params: {
        unread: false,
        page: 1,
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getNotfications"],
    queryFn: notficationsApi,
  });

  const notifications: NotificationType[] = data?.data.data.notifications ?? [];

  function markAllNotficationApi() {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/read-all`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate } = useMutation({
    mutationFn: markAllNotficationApi,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getNotfications"] });
      query.invalidateQueries({ queryKey: ["getNotficationCount"] });
    },
  });

  return (
    <>
      <div
        role="menu"
        className="fixed inset-x-4 top-[4.5rem] z-50 rounded-3xl bg-white shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Notifications
            </h3>
            {unreadNotficationCount > 0 && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                {unreadNotficationCount} new
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              mutate();
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <FiCheck />
            Mark all as read
          </button>
        </div>

        <ul className="max-h-96 space-y-1 overflow-y-auto p-2">
          {isLoading ? (
            <NotificationSkeleton count={unreadNotficationCount} />
          ) : isError ? (
            <NotficationError onRetry={() => refetch()} />
          ) : notifications.length == 0 ? (
            <NotificationEmpty />
          ) : (
            notifications.map((notficationData) => {
              return (
                <NotficationList
                  notficationData={notficationData}
                  setIsNotficationOpen={setIsNotficationOpen}
                  key={notficationData._id}
                />
              );
            })
          )}
        </ul>

        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            className="w-full cursor-pointer rounded-xl py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
