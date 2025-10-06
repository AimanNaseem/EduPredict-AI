import React, { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import axios from "axios";

const Feedback = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
  // Get the raw item from localStorage
  const adminData = localStorage.getItem("admin");
  const teacherData = localStorage.getItem("teacher");
  const studentData = localStorage.getItem("student");

  // Extract actual token string
  const getToken = (data) => {
    try {
      const parsed = JSON.parse(data);
      return parsed.token;
    } catch (err) {
      return data; // In case it's already a plain token
    }
  };

  const token = getToken(adminData || teacherData || studentData);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/feedback", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    }
  };

  fetchFeedbacks();
}, []);

  const filteredFeedbacks = feedbacks
    .filter((fb) => fb.role !== "admin") // Exclude Admin feedbacks
    .filter((fb) => {
      const roleMatch =
        roleFilter === "All Roles" ||
        (fb.role && fb.role.toLowerCase() === roleFilter.toLowerCase());

      const searchMatch =
        searchQuery === "" ||
        fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.content.toLowerCase().includes(searchQuery.toLowerCase());

      return roleMatch && searchMatch;
    });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Feedback Management
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap mb-4">
            {/* 🔍 Search Box */}
            <div className="relative w-full md:max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 bg-white/80 text-sm focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 🔘 Role Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-200 bg-white/80 text-sm focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
              >
                <option value="All Roles">All Roles</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeedbacks.map((fb, index) => (
                <tr key={fb._id} className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                  <td className="py-4 px-4 text-gray-700">{fb.title}</td>
                  <td className="py-4 px-4 text-gray-500">{fb.from}</td>
                  <td className="py-4 px-4">
                  <span
  className={`px-2 py-1 rounded-md text-sm 
    ${fb.role?.toLowerCase() === "teacher" ? "bg-blue-200 text-blue-800" : ""} 
    ${fb.role?.toLowerCase() === "student" ? "bg-green-200 text-green-800" : ""} 
    ${fb.role?.toLowerCase() === "admin" ? "bg-purple-200 text-purple-800" : ""}`}
>
  {fb.role}
</span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {fb.content.length > 100
                      ? fb.content.substring(0, 100) + "..."
                      : fb.content}
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    {new Date(fb.received).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
              {filteredFeedbacks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
