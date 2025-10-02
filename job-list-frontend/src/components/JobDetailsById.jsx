import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { cross } from "./Svgs";
import { Briefcase, Building2, MapPin, Tag, Calendar } from "lucide-react";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

export default function JobDetailsById({ isOpen, onClose, jobId }) {
  // Fetch job details when modal is open
  const { data, isLoading, isError } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await API.get(`/jobs/${jobId}`);
      return res.data;
    },
    enabled: !!jobId && isOpen, // only fetch when modal is open
  });

  const job = data?.job;

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
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600  px-6 pt-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Job Details</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition"
              >
                {cross}
              </button>
            </div>

            {/* Content */}
            <div className="px-6 mt-4 pb-4 space-y-6">
              {isLoading && (
                <p className="text-slate-500 text-center">Loading...</p>
              )}
              {isError && toast.error("Failed to load job details")}
              {job && (
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className="text-2xl mt-4 !py-2 font-bold text-slate-900">
                    {job.title}
                  </h3>

                  {/* Company + Location + Type */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-5 h-5 text-violet-600" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      <span>{job.job_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-5 h-5 text-rose-600" />
                      <span>{job.posting_date}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {job.tags && (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(job.tags)
                        ? job.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-violet-100 text-violet-700 text-xs px-3 py-1 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))
                        : job.tags
                            .split(",")
                            .map((tag, idx) => (
                              <span
                                key={idx}
                                className="bg-violet-100 text-violet-700 text-xs px-3 py-1 rounded-full font-medium"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
