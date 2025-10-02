import React from "react";

export default function Pagination({ pagination, setPage }) {
  if (!pagination) return null;

  const {
    current_page,
    total_pages,
    has_prev,
    has_next,
    per_page,
    total_items,
    prev_page,
    next_page,
  } = pagination;

  // Calculate displayed items range
  const startItem = (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total_items);

  return (
    <div className="mt-8 space-y-4">
      {/* Pagination Info Card */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg p-4 border border-violet-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Showing
              </span>
              <span className="text-lg font-bold text-violet-600">
                {startItem}-{endItem}
              </span>
            </div>
            <div className="h-8 w-px bg-violet-200"></div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Total Items
              </span>
              <span className="text-lg font-bold text-slate-700">
                {total_items}
              </span>
            </div>
            <div className="h-8 w-px bg-violet-200"></div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Page
              </span>
              <span className="text-lg font-bold text-slate-700">
                {current_page} of {total_pages}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="px-3 py-1 bg-white rounded-full border border-violet-200">
              {per_page} per page
            </span>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600">
          {has_prev ? (
            <span>
              Previous page: <span className="font-semibold">{prev_page}</span>
            </span>
          ) : (
            <span className="text-slate-400">First page</span>
          )}
        </div>

        <nav>
          <ul className="inline-flex items-center -space-x-px shadow-sm">
            {/* Prev button */}
            <li>
              <button
                disabled={!has_prev}
                onClick={() => setPage(current_page - 1)}
                className={`size-10 inline-flex justify-center items-center rounded-l-lg border transition-all duration-200 ${
                  has_prev
                    ? "text-slate-600 bg-white border-slate-300 hover:bg-violet-600 hover:text-white hover:border-violet-600"
                    : "text-gray-300 bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </li>

            {/* Page numbers */}
            {[...Array(total_pages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <li key={pageNum}>
                  <button
                    onClick={() => setPage(pageNum)}
                    className={`size-10 inline-flex justify-center items-center border-t border-b transition-all duration-200 ${
                      pageNum === current_page
                        ? "bg-violet-600 text-white border-violet-600 font-semibold z-10"
                        : "text-slate-600 bg-white border-slate-300 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}

            {/* Next button */}
            <li>
              <button
                disabled={!has_next}
                onClick={() => setPage(current_page + 1)}
                className={`size-10 inline-flex justify-center items-center rounded-r-lg border transition-all duration-200 ${
                  has_next
                    ? "text-slate-600 bg-white border-slate-300 hover:bg-violet-600 hover:text-white hover:border-violet-600"
                    : "text-gray-300 bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>

        <div className="text-sm text-slate-600">
          {has_next ? (
            <span>
              Next page: <span className="font-semibold">{next_page}</span>
            </span>
          ) : (
            <span className="text-slate-400">Last page</span>
          )}
        </div>
      </div>
    </div>
  );
}