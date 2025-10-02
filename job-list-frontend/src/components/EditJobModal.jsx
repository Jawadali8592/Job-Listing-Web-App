import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/Button.css";
import { companysvg, cross, jobtitlesvg, jobtypesvg, locationvg, tagssvg } from "./Svgs";

export default function EditJobModal({ job, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "",
    tags: "",
  });

  const queryClient = useQueryClient();

  const API = axios.create({
    baseURL: "http://127.0.0.1:5000/api",
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        job_type: job.job_type || "",
        tags: job.tags?.join(", ") || "",
      });
    }
  }, [job]);

  const updateJob = async (updatedData) => {
    const { data } = await API.patch(`/jobs/${job.id}`, updatedData);
    return data;
  };

  const mutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries(["jobs"]);
      onClose();
    },
    onError: () => {
      toast.error("Failed to update job");
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
    mutation.mutate({
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
    });
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
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold ">Edit Job</h2>
                  <p className="font-bold- text-sm mt-4">
                    Update job details below
                  </p>
                </div>
                <button onClick={onClose} className="  transition-colors">
                  {cross}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Job Title
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
                    className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Company
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
                    className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Location & Job Type - Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {locationvg}
                    </div>
                    <input
                      type="text"
                      name="location"
                      placeholder="Remote"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
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
                    <input
                      type="text"
                      name="job_type"
                      placeholder="Full-time"
                      value={formData.job_type}
                      onChange={handleChange}
                      className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                    />
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
                    className="w-full !pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Separate tags with commas
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="delete-button">
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
                    <span className="button-content">Saving...</span>
                  ) : (
                    <div className="button-content">Save Changes</div>
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
