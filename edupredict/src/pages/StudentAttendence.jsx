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
import { attendance_course_performance } from "../Api/internal";
import Loader from "../components/Custom/Loader";

function StudentAttendance() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("Select Batch");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await attendance_course_performance(selectedBatch);
      if (response.status === 200) {
        setData(response.data.metrics || []);
      }
    } catch (error) {
      console.error("Error fetching attendance data", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data by batch
  useEffect(() => {
    if (!selectedBatch || selectedBatch === "Select Batch") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.batch === selectedBatch);
      setFilteredData(filtered);
    }
  }, [selectedBatch, data]);

  // Convert JSON → CSV and trigger download
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
    if (selectedBatch !== "Select Batch" && filteredData.length > 0) {
      downloadCSV(filteredData, `attendance_${selectedBatch}.csv`);
    } else {
      downloadCSV(data, "attendance_all.csv");
    }
  };

  // Prepare chart data
  const chartData = filteredData.map((item) => ({
    month: item.month,
    name: item.course,
    present: item.present_count,
    absent: item.absent_count,
    late: item.late_count
  }));

  // Prepare table data
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

  return (
    <div className="w-full min-h-screen  items-center p-4 flex flex-col">
      <div className="w-full max-w-7xl">
        {/* Performance Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
            <div>
             <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Attendance Performance
              </h2>
              <p className="text-gray-600">
               Total attendance by Course
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
              {/* Batch Select */}
              <div className="relative">
                <select
                 className="appearance-none w-full sm:w-auto bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9078e2] transition"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="Select Batch">Select Batch</option>
                  <option value="B001">B001</option>
                  <option value="B002">B002</option>
                  <option value="B003">B003</option>
                  <option value="B004">B004</option>
                  <option value="B005">B005</option>
                  <option value="B006">B006</option>
                  <option value="B007">B007</option>
                  <option value="B008">B008</option>
                  <option value="B009">B009</option>
                  <option value="B010">B010</option>
                  <option value="B011">B011</option>
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
                  data={chartData}
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
                            <p>Month: {payload[0].payload.month}</p>
                            <p className="font-semibold">
                              Course: {payload[0].payload.name}
                            </p>
                            <p>Present: {payload[0].payload.present}</p>
                            <p>Absent: {payload[0].payload.absent}</p>
                            <p>Late: {payload[0].payload.late}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="present" fill="#9078e2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="#ff7e67" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" fill="#c4bef0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Please select a batch to view data
            </p>
          )}
        </div>

        {/* Breakdown Table */}
        <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Attendance Breakdown
          </h2>
          <p className="text-gray-600 mb-6">
            Detailed attendance for each course
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
              No attendance data available for this batch
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAttendance;
