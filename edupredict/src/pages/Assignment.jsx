import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import { fetch_assignment_summary } from "../Api/internal"; // <-- yahan import karein
import Loader from "../components/Custom/Loader";

function Assignments() {
  const [allData, setAllData] = useState([]); // full backend data (month+course)
  const [filteredData, setFilteredData] = useState([]); // filtered by month
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(false); // initially no filter

  useEffect(() => {
    setLoading(true);
    fetch_assignment_summary()
      .then((res) => {
        setAllData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch assignment data:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedBatch || selectedBatch === "Select Batch") {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter((item) => item.batch === selectedBatch);
      setFilteredData(filtered);
    }
  }, [selectedBatch, allData]);

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
      downloadCSV(filteredData, `Assignment ${selectedBatch}.csv`);
    } else {
      downloadCSV(allData, "Assignment_all.csv");
    }
  };




  const formattedData = filteredData.map((item) => ({
    month: item.month,
    name: item.course,
    total: item.total_assignments_completed,
    score: item.total_assignments_completed, // same for BarChart dataKey
  }));

  if (loading || !formattedData) return <Loader />;

  return (
    <div className="flex w-full min-h-screen justify-center items-center p-4">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col">
          {/* Chart Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
              <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Assignment Performance
                </h1>
                <p className="text-gray-600">
                  Total assignments completed
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
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

                    {/* <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option> */}
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
                <button  
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#9078e2] text-white font-medium hover:bg-[#7c64d4] transition w-full sm:w-auto">
                  <DownloadIcon size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eaeaea"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                    height={50}
                  />
                  <YAxis
                    domain={[0, "dataMax"]}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
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
                            <p>Total assignments: {payload[0].payload.total}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#9078e2"
                    radius={[4, 4, 0, 0]}
                    barSize={100}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Assignment Breakdown
            </h2>
            <p className="text-gray-600 mb-6">
              Total assignments completed
            </p>
            <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Courses
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Month
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Total Assignments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.map((item, index) => (
                   <tr key={index}>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.month}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assignments;
