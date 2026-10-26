import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiUserPlus } from "react-icons/fi";
import SuggestionCard from "../../Components/Suggestions/SuggestionCard";
import SuggestionsError from "../../Components/Suggestions/SuggestionsError";
import SuggestionsLoading from "../../Components/Suggestions/SuggestionsLoading";
import SuggestionsPagination from "../../Components/Suggestions/SuggestionsPagination";
import { Helmet } from "react-helmet";

export default function FollowSuggestions() {
  function getFollowSuggestions(page: number) {
    return axios
      .get("https://route-posts.routemisr.com/users/suggestions", {
        params: {
          page,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => res.data);
  }

  const {
    data,
    isError,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getFollowSuggestions"],
    queryFn: ({ pageParam }) => getFollowSuggestions(pageParam),
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.meta.pagination.nextPage ?? undefined,
  });

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Elvora | Suggestions</title>
        </Helmet>
        <SuggestionsLoading isFull={true} />;
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Helmet>
          <title>Elvora | Suggestions</title>
        </Helmet>
        <SuggestionsError
          message={
            axios.isAxiosError<{ message?: string }>(error)
              ? error.response?.data?.message
              : error.message
          }
          onRetry={() => {
            refetch();
          }}
        />
      </>
    );
  }

  return (
    <>
    <Helmet>
        <title>Elvora | Suggestions</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-36 pt-3 ">
        <div className="mx-auto w-full max-w-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-200">
              <FiUserPlus />
            </span>
  
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                People you may know
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Follow people to see their posts in your feed.
              </p>
            </div>
          </div>
  
          {/* Suggestions grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {data?.pages
              .flatMap((page) => page.data.suggestions)
              .map((user) => {
                return <SuggestionCard key={user._id} user={user} />;
              })}
          </div>
  
          {isFetchingNextPage && <SuggestionsLoading isFull={false} />}
  
          <SuggestionsPagination
            currentPage={data?.pages[0].meta.pagination.currentPage}
            numberOfPages={data?.pages[0].meta.pagination.numberOfPages}
            fetchNextPage={() => {
              fetchNextPage();
            }}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </div>
    </>
  );
}
