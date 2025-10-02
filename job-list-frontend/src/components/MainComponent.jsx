import { useState } from "react";
import Header from "./Header";
import Pagination from "./Pagination";
import CoursesTwo from "./CourseTwo";
import CoursesSidebar from "./JobFiltersSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AddJobModal from "./JobPostModal";
import JobFiltersComponent from "./JobFiltersComponent";
import JobDetailsById from "./JobDetailsById";

export default function MainComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    job_type: "",
    location: "",
    tag: "",
    sort: "posting_date_desc",
  });

  const API = axios.create({
    baseURL: "http://127.0.0.1:5000/api",
  });

  const queryClient = useQueryClient();

  const fetchJobs = async (page, filterParams) => {
    const params = new URLSearchParams();
    params.append("page", page);

    // Add filters to query params if they have values
    if (filterParams.search) params.append("search", filterParams.search);
    if (filterParams.job_type) params.append("job_type", filterParams.job_type);
    if (filterParams.location) params.append("location", filterParams.location);
    if (filterParams.tag) params.append("tag", filterParams.tag);
    if (filterParams.sort) params.append("sort", filterParams.sort);

    const { data } = await API.get(`/jobs?${params.toString()}`);
    return data;
  };

  const {
    data: jobs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs", currentPage, filters],
    queryFn: () => fetchJobs(currentPage, filters),
  });

  // Delete Mutation
  const deleteJob = async (id) => {
    await API.delete(`/jobs/${id}`);
  };

  const mutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries(["jobs"]);
    },
    onError: () => {
      toast.error("Failed to delete job");
    },
  });

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      job_type: "",
      location: "",
      tag: "",
      sort: "posting_date_desc",
    });
    setCurrentPage(1);
  };


 const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (id) => {
    setSelectedJobId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };


  return (
    <>
      <Header setIsAddModalOpen={setIsAddModalOpen} />

      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

       <JobDetailsById
        isOpen={isModalOpen}
        onClose={closeModal}
        jobId={selectedJobId}
      />
      <Toaster position="top-right" reverseOrder={false} />

      <section className="relative py-12">
        <div className="container relative">
          {/* Filter Component */}
          {/* <JobFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          /> */}

          <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
            <div className="lg:col-span-8 md:col-span-8 md:order-1 order-2">
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : isError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading jobs
                </div>
              ) : jobs?.jobs?.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No jobs found matching your filters
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {jobs?.jobs?.map((item, index) => (
                   
                   <div
            key={index}
          >

                   <CoursesTwo
            openModal={openModal} // 👈 Open modal with job ID

                        onDelete={() => mutation.mutate(item.id)}
                        item={item}
                        key={index}
                        />
                        </div>
                    ))}
                  </div>

                  <Pagination
                    pagination={jobs?.pagination}
                    setPage={setCurrentPage}
                  />
                </>
              )}
            </div>

            <div className="lg:col-span-4 md:col-span-4 md:order-2 order-1">
              <CoursesSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
