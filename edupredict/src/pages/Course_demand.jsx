import React, { useEffect, useState } from "react";
import { DownloadIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { course_demand } from "../Api/internal";
import Loader from "../components/Custom/Loader";

const Course_demand = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchdata = async () => {
    setLoading(true);
    const response = await course_demand();
    if (response.status === 200) {
      setData(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchdata();
  }, []);


  const downloadCSV = (rows, filename) => {
    if (!rows.length) {
      alert("No data available to download");
      return;
    }

    const headers = Object.keys(rows[0]).join(",");
    const csv = [
      headers,
      ...rows.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`) // wrap values in quotes for safety
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Handle download
  const handleDownload = () => {
    const today = new Date().toISOString().split("T")[0]; // 2025-08-22
    if (data.length > 0) {
      downloadCSV(data, `Course_demand_${today}.csv`);
    } else {
      downloadCSV(data, `Course_demand_${today}.csv`);
    }
  };


  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
         <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
              <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Course Demand
                </h1>
                <p className="text-gray-600">
                Course Id and preferred_course Course demand predictions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
                <button  
               onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#9078e2] text-white font-medium hover:bg-[#7c64d4] transition w-full sm:w-auto">
                  <DownloadIcon size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>

      

      {/* Table */}
      <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                Preferred Course
              </th>
              {/* <th className="text-left py-3 px-4 font-medium text-gray-600">
                Course
              </th> */}
              <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
               Actual Course Demand
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
               Predicted Course Demand
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedData.map((student, index) => (
                <motion.tr
                  key={student.course_id + index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-3 px-4 text-gray-800 border border-gray-300">
                    {student.course}
                  </td>
                  {/* <td className="py-3 px-4 text-gray-800">
                    {student.course_id}
                  </td> */}
                 
                 <td className="py-3 px-4 text-gray-800 border border-gray-300">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        student.actual_course_demand === "High"
                          ? "bg-red-100 text-red-700"
                          : student.actual_course_demand === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {student.actual_course_demand}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800 border border-gray-300">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        student.predicted_course_demand === "High"
                          ? "bg-red-100 text-red-700"
                          : student.predicted_course_demand === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {student.predicted_course_demand}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Course_demand;
