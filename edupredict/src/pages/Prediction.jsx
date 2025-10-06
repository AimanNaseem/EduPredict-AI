import React, { useState, useEffect } from "react";
import { LineChartIcon, DownloadIcon, ChevronDownIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Loader from "../components/Custom/Loader";

function Prediction() {
  const [loading, setLoading] = useState(true);
  const [predictionData, setPredictionData] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
  });
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [riskRes, studentRes] = await Promise.all([
          axios.get("http://localhost:3001/dropout_risk_by_course"),
          axios.get("http://localhost:3001/dropout_risk_percentage"),
        ]);

        const grouped = { Low: 0, Medium: 0, High: 0 };
        riskRes.data.forEach((item) => {
          const risk = item.predicted_dropout_risk;
          if (risk === "Low") grouped.Low += item.student_count;
          else if (risk === "Medium") grouped.Medium += item.student_count;
          else if (risk === "High") grouped.High += item.student_count;
        });

        setPredictionData(grouped);
        setStudentData(studentRes.data);
      } catch (err) {
        console.error("API Error:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  if (loading) return <Loader />;
  const total =
    predictionData.Low + predictionData.Medium + predictionData.High;
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
      downloadCSV(studentData, `Dropout_risk_${today}.csv`);
    } else {
      downloadCSV(studentData, `Dropout_risk_${today}.csv`);
    }
  };


  return (
    <div className="rounded-lg p-4 min-h-screen w-full md:p-8 ">
      <div className="max-w-7xl mx-auto space-y-6 ">
        {/* ✅ Prediction Overview with Dynamic Custom Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <LineChartIcon className="text-blue-500" size={20} />
            <h2 className="text-2xl font-bold text-gray-800">
              Prediction Overview
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Summary of dropout risk predictions across students.
          </p>
          <div className="space-y-4">
            {["Low", "Medium", "High"].map((level) => (
              <div className="flex items-center" key={level}>
                <div className="w-24 text-gray-600 text-right pr-4">
                  {level}
                </div>
                <div className="w-full bg-gray-100 h-12 rounded relative">
                  <div
                    className={`absolute left-0 top-0 h-full rounded transition-all duration-300 ${
                      level === "Low"
                        ? "bg-[#9078e2]"
                        : level === "Medium"
                        ? "bg-[#c4bef0]"
                        : "bg-[#ff7e67]"
                    }`}
                    style={{ width: getBarWidth(predictionData[level]) }}
                  ></div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-700">
                    {predictionData[level]} Students
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-gray-600">Student Count</div>
        </motion.div>

        {/* 🔽 Detailed Predictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
              <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Detailed Predictions
                </h1>
                <p className="text-gray-600">
                Individual student dropout risk predictions.
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

         

          {/* Table Section */}
          <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Student Name
                  </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Batch_id
                  </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Teacher_Name
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Month
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Course
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Dropout Risk
                  </th>
                  {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Dropout Risk</th> */}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {studentData
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((student, index) => {
                      const riskColor = {
                        Low: "bg-green-200 text-green-800",
                        Medium: "bg-orange-200 text-orange-800",
                        High: "bg-red-200 text-red-800",
                      };

                      return (
                        <motion.tr
                          key={student.student_id + index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                            <td className="py-3 px-4 text-gray-800 border border-gray-300">
                            {student.name}
                          </td>
                           <td className="py-3 px-4 text-gray-800 border border-gray-300">
                            {student.Batch}
                          </td>
                            <td className="py-3 px-4 text-gray-800 border border-gray-300">
                            {student.teacher_name}
                          </td>
                          <td className="py-3 px-4 text-gray-800 border border-gray-300">
                            {student.Month}
                          </td>
                          <td className="py-3 px-4 text-gray-800 border border-gray-300">
                            {student.Course}
                          </td>

                          <td className="py-3 px-4 text-gray-800 border border-gray-300">
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                riskColor[student.risk_level]
                              }`}
                            >
                              {student.risk_level}
                            </span>
                          </td>
                          {/* <td className="py-3 px-4 text-gray-800">{percentage}</td> */}
                        </motion.tr>
                      );
                    })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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

export default Prediction;
