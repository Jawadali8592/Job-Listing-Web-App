import React from "react";

export default function JobFiltersComponent({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.job_type}
            onChange={(e) => onFilterChange("job_type", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Remote, NYC"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Tag */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tag
          </label>
          <input
            type="text"
            placeholder="e.g. React"
            value={filters.tag}
            onChange={(e) => onFilterChange("tag", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange("sort", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="posting_date_desc">Newest First</option>
            <option value="posting_date_asc">Oldest First</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
