import React from "react";
import { Link } from "react-router-dom";
import "../css/Button.css";

import { FiChevronRight } from "react-icons/fi";
export default function Header({ setIsAddModalOpen }) {
  return (
    <div>
      <section className="relative py-5 bg-slate-50 dark:bg-slate-800 ">
        <div className="container relative">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-2 items-center">
            <div className="lg:col-span-5 md:col-span-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="button"
              >
                <span className="button-content">Add New Job </span>
              </button>
            </div>

            <div className="lg:col-span-7 md:col-span-8 md:text-end">
              <ul className="tracking-[0.5px] mb-0 inline-block">
                <li className="inline-block text-slate-400 dark:text-white/60 duration-500 ease-in-out hover:text-violet-600 dark:hover:text-white">
                  <Link to="/courses">Jobs</Link>
                </li>
                <li className="inline-block text-slate-500 mt-1 dark:text-white/60 mx-0.5 ltr:rotate-0 rtl:rotate-180">
                  <FiChevronRight className="align-middle" />
                </li>
                <li
                  className="inline-block text-violet-600 dark:text-white"
                  aria-current="page"
                >
                  Jobs Listing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
