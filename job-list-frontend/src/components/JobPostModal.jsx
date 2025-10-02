import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/Button.css";
import {
  companysvg,
  cross,
  jobtitlesvg,
  jobtypesvg,
  locationvg,
  tagssvg,
  calendarsvg,
} from "./Svgs";

export default function AddJobModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    posting_date: "",
    job_type: "Full-time",
    tags: "",
  });

  const queryClient = useQueryClient();

  const API = axios.create({
    baseURL: "http://127.0.0.1:5000/api",
  });

  const createJob = async (jobData) => {
    const { data } = await API.post("/jobs", jobData);
    return data;
  };

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success("Job created successfully!");
      queryClient.invalidateQueries(["jobs"]);
      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        posting_date: "",
        job_type: "Full-time",
        tags: "",
      });
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create job");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for API
    const jobData = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      job_type: formData.job_type,
    };

    // Add optional fields only if they have values
    if (formData.posting_date) {
      jobData.posting_date = formData.posting_date;
    }

    if (formData.tags) {
      jobData.tags = formData.tags.split(",").map((t) => t.trim());
    }

    mutation.mutate(jobData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="">
              <div className="flex items-center justify-between px-4 pt-6">
                  <h2 className="text-xl font-bold">Add New Job</h2>
                  
                <button onClick={onClose} className="transition-colors">
                  {cross}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {jobtitlesvg}
                  </div>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {companysvg}
                  </div>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Tech Corp"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {locationvg}
                  </div>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Remote, New York, USA"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Posting Date & Job Type - Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Posting Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="date"
                      name="posting_date"
                      value={formData.posting_date}
                      onChange={handleChange}
                      className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Job Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {jobtypesvg}
                    </div>
                    <select
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleChange}
                      className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 transition-all appearance-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Tags
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {tagssvg}
                  </div>
                  <input
                    type="text"
                    name="tags"
                    placeholder="React, JavaScript, Node.js"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Separate tags with commas
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="delete-button"
                >
                  <span className="delete-button-content flex items-center gap-2">
                    Cancel
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={mutation.isLoading}
                  className="button"
                >
                  {mutation.isLoading ? (
                    <span className="button-content">Creating...</span>
                  ) : (
                    <div className="button-content">Create Job</div>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}