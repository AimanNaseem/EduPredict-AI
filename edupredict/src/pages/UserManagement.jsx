import React, { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import axios from "axios";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [users, setUsers] = useState([]);

  const filteredUsers = users
    .filter((user) => {
      const roleMatch =
        roleFilter === "All Roles" ||
        (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());

      const statusMatch =
        statusFilter === "All Status" ||
        (statusFilter === "Active" && user.isActive === true) ||
        (statusFilter === "Inactive" && user.isActive === false);

      return roleMatch && statusMatch;
    })
    .filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        searchQuery === "" ||
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower)
      );
    });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user");
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          User Management
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap mb-4">
            {/* 🔍 Search Box */}
            <div className="relative w-full md:max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9078e2] h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 bg-white/80 text-sm focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 🔘 Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-200 bg-white/80 text-sm focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
              >
                <option value="All Roles">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-200 bg-white/80 text-sm focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id || user._id}
                  className="border-b border-gray-200"
                >
                  <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                  <td className="py-4 px-4 text-gray-700">{user.name}</td>
                  <td className="py-4 px-4 text-gray-500">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm 
    ${
      user.role?.toLowerCase() === "teacher" ? "bg-blue-200 text-blue-800" : ""
    } 
    ${
      user.role?.toLowerCase() === "student"
        ? "bg-green-200 text-green-800"
        : ""
    } 
    ${
      user.role?.toLowerCase() === "admin"
        ? "bg-purple-200 text-purple-800"
        : ""
    }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-md text-md ${
                        user.isActive
                          ? "bg-green-300 text-green-700"
                          : "bg-red-300 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })
                      : "Not logged in yet"}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No users found.
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

export default UserManagement;
