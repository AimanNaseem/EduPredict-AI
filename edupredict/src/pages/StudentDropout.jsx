import React, { useState, useEffect } from "react";
import { DownloadIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Loader from "../components/Custom/Loader";

function StudentDropout() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerCategory = 5;

  // ===== Load user info from localStorage =====

 useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentRes = await axios.get(
          "http://localhost:3001/dropout_risk_percentage"
        );
        setStudentData(studentRes.data);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, []);
  if (loading || !studentData) return <Loader />;
  // Categorize students by risk
  const lowRiskStudents = studentData.filter(
    (student) => student.risk_level === "Low"
  );

  const mediumRiskStudents = studentData.filter(
    (student) => student.risk_level === "Medium"
  );

  const highRiskStudents = studentData.filter(
    (student) => student.risk_level === "High"
  );

  
  // ===== Fetch once userData loaded =====
  

  

  const riskColor = {
    Low: "bg-green-200 text-green-800",
    Medium: "bg-orange-200 text-orange-800",
    High: "bg-red-200 text-red-800",
  };
  // ✅ Pagination
  const startIndex = (currentPage - 1) * itemsPerCategory;
  const endIndex = currentPage * itemsPerCategory;

  const pageLow = lowRiskStudents.slice(startIndex, endIndex);
  const pageMedium = mediumRiskStudents.slice(startIndex, endIndex);
  const pageHigh = highRiskStudents.slice(startIndex, endIndex);

  const paginatedData = [...pageLow, ...pageMedium, ...pageHigh].sort(
    () => Math.random() - 0.5
  );

  const totalPages = Math.ceil(
    Math.max(
      lowRiskStudents.length,
      mediumRiskStudents.length,
      highRiskStudents.length
    ) / itemsPerCategory
  );
    // ✅ CSV Download

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
  
const handleDownload = () => {
    const today = new Date().toISOString().split("T")[0]; // 2025-08-22
    if (studentData.length > 0) {
      downloadCSV(studentData, `Dropout_risk_${today}.csv`);
    } else {
      downloadCSV(studentData, `Dropout_risk_${today}.csv`);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Dropout Risk Student
          </h1>
          <p className="text-gray-600">
            Individual student dropout risk predictions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          {/* Month Dropdown */}
          <button 
            onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#9078e2] text-white font-medium hover:bg-[#7c64d4] transition w-full sm:w-auto">
            
            
            <DownloadIcon size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {paginatedData.length > 0 ? (
     <div className="overflow-x-auto rounded-lg shadow">
  <table className="min-w-full border border-gray-300 bg-white">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="py-3 px-4 text-left text-gray-700 font-semibold border border-gray-300">Student Name</th>
        <th className="py-3 px-4 text-left text-gray-700 font-semibold border border-gray-300">Month</th>
        <th className="py-3 px-4 text-left text-gray-700 font-semibold border border-gray-300">Course</th>
        <th className="py-3 px-4 text-center text-gray-700 font-semibold border border-gray-300">Attendance</th>
        <th className="py-3 px-4 text-center text-gray-700 font-semibold border border-gray-300">GPA</th>
        <th className="py-3 px-4 text-center text-gray-700 font-semibold border border-gray-300">Assignments</th>
        <th className="py-3 px-4 text-center text-gray-700 font-semibold border border-gray-300">Quizzes</th>
        <th className="py-3 px-4 text-center text-gray-700 font-semibold border border-gray-300">LMS Score</th>
        <th className="py-3 px-4 text-center text-gray-700 font-semibold border border-gray-300">Prev. Failures</th>
        <th className="py-3 px-4 text-center text-gray-700 font-semibold border border-gray-300">Risk Level</th>
        <th className="py-3 px-4 text-left text-gray-700 font-semibold border border-gray-300">Reason</th>
      </tr>
    </thead>

    <tbody>
      <AnimatePresence>
        {paginatedData.map((student, index) => {
          const riskLevel =
            student.risk_level?.charAt(0).toUpperCase() +
            student.risk_level?.slice(1).toLowerCase();

          return (
            <motion.tr
              key={student.student_id + index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-800 border border-gray-300">{student.name}</td>
              <td className="py-3 px-4 text-gray-800 border border-gray-300">{student.Month}</td>
              <td className="py-3 px-4 text-gray-800 border border-gray-300">{student.Course}</td>
              <td className="py-3 px-4 text-center text-gray-800 border border-gray-300">{student.attendance}</td>
              <td className="py-3 px-4 text-center text-gray-800 border border-gray-300">{student.gpa}</td>
              <td className="py-3 px-4 text-center text-gray-800 border border-gray-300">{student.assignments_completed}</td>
              <td className="py-3 px-4 text-center text-gray-800 border border-gray-300">{student.quizzes_completed}</td>
              <td className="py-3 px-4 text-center text-gray-800 border border-gray-300">{student.lms_engagement_score}</td>
              <td className="py-3 px-4 text-center text-gray-800 border border-gray-300">{student.previous_failures}</td>
              <td className="py-3 px-4 text-center border border-gray-300">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    riskColor[riskLevel]
                  }`}
                >
                  {riskLevel}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-800 border border-gray-300">
                {student.risk_reason?.length > 20 ? (
                  <>
                    {student.risk_reason.slice(0, 20)}...
                    <button
                      className="text-blue-600 underline ml-1"
                      onClick={() => setSelectedReason(student.risk_reason)}
                    >
                      Read More
                    </button>
                  </>
                ) : (
                  student.risk_reason
                )}
              </td>
            </motion.tr>
          );
        })}
      </AnimatePresence>
    </tbody>
  </table>

  {/* Modal */}
  <AnimatePresence>
    {selectedReason && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3">Reason</h2>
          <p className="text-gray-700 whitespace-pre-line">{selectedReason}</p>
          <button
            onClick={() => setSelectedReason(null)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
 ) : (
              <p className="text-center text-gray-500">
                No Dropout Risk Student available for this teacher
              </p>
            )}


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
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}

export default StudentDropout;
