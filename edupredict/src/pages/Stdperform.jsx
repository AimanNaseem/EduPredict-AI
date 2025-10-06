import React, { useState, useEffect } from "react";
import { LineChartIcon, DownloadIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Loader from "../components/Custom/Loader";

function Stdperform() {
  const [predictionData, setPredictionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [perfSummaryRes, studentProbRes] = await Promise.all([
          axios.get("http://localhost:3001/performance_summary"),
          axios.get("http://localhost:3001/get_student_probabilities"),
        ]);

        const perfData = perfSummaryRes.data || [];

        setPredictionData(perfData);
        setStudentData(studentProbRes.data);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  const total = predictionData.reduce(
    (sum, item) => sum + item.student_count,
    0
  );
  const getBarWidth = (count) => {
    if (total === 0) return "0%";
    return `${(count / total) * 100}%`;
  };



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
    if (studentData.length > 0) {
      downloadCSV(studentData, `Student Predicted Performance${today}.csv`);
    } else {
      downloadCSV(studentData, `Student Predicted Performance${today}.csv`);
    }
  };




  return (
    <div className="rounded-lg p-4 min-h-screen w-full md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Prediction Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <LineChartIcon className="text-blue-500" size={20} />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Student Predicted Performance
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Overview of predicted performance across students.
          </p>

          <div className="space-y-4">
            {predictionData.map((item, idx) => (
              <div className="flex items-center" key={idx}>
                <div className="w-32 text-gray-600 text-right pr-4">
                  {item.predicted_performance}
                </div>
                <div className="w-full bg-gray-100 h-12 rounded relative">
                  <div
                    className={`absolute left-0 top-0 h-full rounded transition-all duration-300`}
                    style={{
                      width: getBarWidth(item.student_count),
                      backgroundColor: [
                        "#a48fe6",
                        "#c4bef0",
                        "#ff7e67",
                        "#9078e2",
                      ][idx % 4],
                    }}
                  ></div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-700">
                    {item.percentage}% Students
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4 text-gray-600">
            Total: {total} Students
          </div>
        </motion.div>

        {/* Detailed Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                Detailed Student Predicted Performance
              </h1>
              <p className="text-gray-600">
                Individual Student Performance Prediction.
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
                    Student Id
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Predicted performance
                  </th>
                  {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Percentage</th> */}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {studentData
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((student, index) => (
                      <motion.tr
                        key={student["Student ID"] + index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="py-3 px-4 text-gray-800 border border-gray-300">
                          {student["Student ID"]}
                        </td>
                        <td className="py-3 px-4 text-gray-800 border border-gray-300">
                          {student["Name"]}
                        </td>
                        <td className="py-3 px-4 text-gray-800 border border-gray-300">
  <span
    className={`text-md px-3 py-1 rounded-full
      ${student["Predicted_performance"] === "Excellent" ? "bg-green-100 text-green-700 px-2 py-1 rounded" : ""}
      ${student["Predicted_performance"] === "Above Average" ? "bg-blue-100 text-blue-700 px-2 py-1 rounded" : ""}
      ${student["Predicted_performance"] === "Average" ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded" : ""}
      ${student["Predicted_performance"] === "Below Average" ? "bg-red-100 text-red-700 px-2 py-1 rounded" : ""}
    `}
  >
    {student["Predicted_performance"]}
  </span>
</td>

                        {/* <td className="py-3 px-4 text-gray-800">{student["Percentage"]}%</td> */}
                      </motion.tr>
                    ))}
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
            <span className="px-4 py-2 text-gray-700">Page {currentPage}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(studentData.length / itemsPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                currentPage === Math.ceil(studentData.length / itemsPerPage)
              }
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Stdperform;
