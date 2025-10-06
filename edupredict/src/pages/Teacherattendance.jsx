import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import { fetch_teacher_analytics } from "../Api/internal";
import Loader from "../components/Custom/Loader";

function Teacherattendance() {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("");
  
    // ✅ API Call
    useEffect(() => {
      const getAnalytics = async () => {
        try {
          const teacherData = JSON.parse(localStorage.getItem("teacher"));
          const token = teacherData?.token;
  
          if (!token) {
            toast.error("No token found. Please login again.");
            setLoading(false);
            return;
          }
  
          const res = await fetch_teacher_analytics(token);
          setAnalytics(Array.isArray(res.data) ? res.data : []);

        } catch (error) {
          toast.error("Failed to fetch analytics");
        } finally {
          setLoading(false);
        }
      };
  
      getAnalytics();
    }, []);
  
    // ✅ Filter Data by Month
    const filteredData = (analytics || []).filter((item) =>
      selectedMonth ? item.month === selectedMonth : true
    );
    
  
    // ✅ CSV Download
    const downloadCSV = (rows, filename) => {
      if (!rows.length) {
        toast.error("No data available to download");
        return;
      }
  
      const headers = Object.keys(rows[0]).join(",");
      const csv = [
        headers,
        ...rows.map((row) =>
          Object.values(row)
            .map((val) => "${val}")
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
      if (filteredData.length > 0) {
        downloadCSV(filteredData, "Attendance_Analytics.csv");
      } else {
        downloadCSV(analytics, "Attendance_Analytics.csv");
      }
    };
  
    const attendanceData = filteredData.map((item) => {
        const present = item.present_count;
        const absent = item.absent_count;
        const late = item.late_count;
        const percentage =
          present + absent + late > 0
            ? ((present / (present + absent + late)) * 100).toFixed(1) + "%"
            : "0%";
    
        return {
        month: item.month,
          name: item.course,
          present,
          absent,
          late,
          percentage,
        };
      });



    if (loading) return <Loader />;
  // Prepare chart data
  const months = [...new Set(analytics.map((item) => item.month))];

  // Prepare table data


  return (
    <div className="w-full min-h-screen items-center p-4 flex flex-col">
      <div className="w-full max-w-7xl">
        {/* Performance Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
            <div>
             <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Monthly Attendance Performance
              </h2>
              <p className="text-gray-600">
               Total attendance Monthly
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
              {/* Batch Select */}
              <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none w-full sm:w-auto bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9078e2] transition"
                  >
                    <option value="">All Months</option>
                    {months.map((month, idx) => (
                      <option key={idx} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#9078e2] text-white font-medium hover:bg-[#7c64d4] transition w-full sm:w-auto"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Chart */}
          {filteredData.length > 0 ? (
            <div className="h-[200px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[0, "dataMax"]}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border shadow p-2 rounded text-sm text-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Month: {payload[0].payload.month}</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                            Course:{" "}
                          <span className="text-blue-600 dark:text-blue-400">
                            {payload[0]?.payload.course}
                          </span>
                            </p>
                            <div className="space-y-1">
                          <p className="text-sm text-[#9078e2] font-medium flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#9078e2] inline-block"></span>
                            Present:{" "}
                            {payload[0].payload.present_count}
                            
                          </p>
                          <p className="text-sm text-[#ff7e67] font-medium flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#ff7e67] inline-block"></span>{" "}
                            Absent:{" "}
                            {payload[0].payload.absent_count}
                          </p>
                          <p className="text-sm text-[#c4bef0] font-medium flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#c4bef0] inline-block"></span>{" "}
                            Late:{" "}
                            {payload[0].payload.late_count}
                            
                          </p>
                        </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="present_count" fill="#9078e2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent_count" fill="#ff7e67" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late_count" fill="#c4bef0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              ⚠ No attendance data available for this teacher
            </p>
          )}
        </div>

        {/* Breakdown Table */}
        <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
        Monthly Attendance Breakdown
          </h2>
          <p className="text-gray-600 mb-6">
            Detailed attendance Monthly
          </p>
          {attendanceData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Month
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Course
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Present
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Absent
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Late
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.month}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.present}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.absent}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.late}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.percentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No attendance data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Teacherattendance;