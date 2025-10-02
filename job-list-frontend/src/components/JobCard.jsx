import React, { useState } from "react";
import { BiBuilding, BiLocationPlus } from "react-icons/bi";
import { FiBook, FiUsers, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import EditJobModal from "./EditJobModal";
import "../css/Button.css";
function timeAgoShort(dateString) {
  const now = new Date();
  const posted = new Date(dateString);
  const seconds = Math.floor((now - posted) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  return `${years}y`;
}

export default function JobCard({ item, onDelete,openModal }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const timeAgo = timeAgoShort(item.posting_date);
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-md shadow-md hover:shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500 w-full mx-auto">
      <div className="md:flex">
        <div className="p-3 md:pe-0 md:pb-3 pb-0 relative md:shrink-0">
          <div className="cursor-pointer" onClick={()=>openModal(item.id)}>

          <img
            src={"/src/assets/dummy.jpg"}
            alt=""
            className="rounded-md size-full object-cover md:w-48"
            style={{ width: "100%", height: "auto" }}
            />
            </div>
          <div className="absolute start-6 top-6">
            <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4 mx-[2px]">
              {timeAgo} ago
            </span>
          </div>
        </div>

        <div className="p-6 w-full">
          <div className="flex mb-3">
            <span className="text-slate-400 text-sm flex items-center">
              <BiLocationPlus className="text-slate-900 dark:text-white size-[14px] me-1" />
              {item.location}
            </span>
            <span className="text-slate-400 text-sm flex items-center ms-3">
              <FiUsers className="text-slate-900 dark:text-white size-[14px] me-1" />
              {item.job_type}
            </span>
          </div>

          <Link
            to={`/course-detail-two/${item.id}`}
            className="text-lg hover:text-violet-600 font-medium"
          >
            {item.title}
          </Link>

          <p className="text-slate-600 font-medium mt-2">
            <span className="text-slate-400">Company:</span> {item.company}
          </p>

          {item.tags.map((tg, index) => {
            return (
              <span
                key={index}
                className="bg-violet-600/10 text-violet-600 text-xs px-2.5 py-0.5 font-semibold rounded-full h-5"
              >
                {tg}
              </span>
            );
          })}

          <div  className="flex gap-2 mt-7">
            <button onClick={() => setIsEditOpen(true)} className="button">
              <span className="button-content">Edit </span>
            </button>

            <button onClick={onDelete} className="delete-button">
              <span className="delete-button-content flex items-center gap-2">
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* ✅ Edit Modal */}
      <EditJobModal
        job={item}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
