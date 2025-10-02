import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function JobFiltersSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-md shadow-lg shadow-slate-100 dark:shadow-slate-800 sticky top-20">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Search Course
        </label>
        <div className="relative mt-2">
          <FiSearch className="absolute top-[10px] start-3 size-5" />
          <input
            name="search"
            id="searchname"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 ps-10"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mt-4">
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

      {/* Location Filter */}

      <div className="mt-4">
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
      <div className="mt-4">
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
      <div className="mt-4">
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

      <div className="mt-5 flex justify-end">
       

 <button onClick={onClearFilters} className="delete-button">
              <span className="delete-button-content flex items-center gap-2">
                    Clear Filters
              </span>
            </button>

      </div>
    </div>
  );
}
