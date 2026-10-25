import { FiChevronRight } from "react-icons/fi";

export default function SuggestionsPagination({
  currentPage,
  numberOfPages,
  fetchNextPage,
  isFetchingNextPage,
}: {
  currentPage: number;
  numberOfPages: number;
  fetchNextPage?: () => void;
  isFetchingNextPage: boolean;
}) {
  return (
    <button
      type="button"
      disabled={currentPage >= numberOfPages || isFetchingNextPage}
      onClick={fetchNextPage}
      className={`mt-8 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 focus:ring-indigo-200 disabled:shadow-none disabled:hover:bg-indigo-600`}
    >
      <span className="hidden sm:inline">Show More</span>
      <FiChevronRight className="text-lg transition group-enabled:group-hover:translate-x-0.5" />
    </button>
  );
}
