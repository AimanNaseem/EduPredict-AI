import React, { useState, useEffect } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { academic_performance } from "../../Api/internal";
import axios from "axios";
import { DownloadIcon } from "lucide-react";

const COLORS = ["#9078e2", "#ff7e67", "#a48fe6", "#c4bef0"];


function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}



const PieCharts = () => {
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
   const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

const [data, setData] = useState({
    batch_id: "",
    course: "",
    months: [],
   
  });
  const [userData, setUserData] = useState({
    name: "",
    batch_id: "",
    courses: "",
  });

useEffect(() => {
    const tokenString = localStorage.getItem("teacher");
    if (!tokenString) return;

    const teacherData = JSON.parse(tokenString);
    const decoded = parseJwt(teacherData.token);
    if (!decoded) return;

    setUserData({
      name: decoded.name,
      batch_id: decoded.batch_id,
      courses: decoded.courses,
    });
  }, []);

  const fetchperformanceData = async (month = "") => {
    const tokenString = localStorage.getItem("teacher");
    if (!tokenString) return console.error("No token found!");

    const teacherData = JSON.parse(tokenString);
    const token = teacherData.token;
    const url = month
  ? `http://localhost:8000/api/teacher/academic_performance?month=${month}`
  : `http://localhost:8000/api/teacher/academic_performance`;


    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data);
      setMonths(res.data.months || []);
      setSelectedMonth(month);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== Fetch once userData loaded =====
  useEffect(() => {
    if (userData?.name) fetchperformanceData();
  }, [userData]);

  // const academicData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await academic_performance();
  //     if (res.status === 200) {
  //       setCourseData(res.data); // res.data should have performance_distribution
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   academicData();
  // }, []);

  // Extract performance_distribution


  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    fetchperformanceData(month);
  };

  const performanceData = data?.performance_distribution;


  // If no data, show message
  if (!performanceData || performanceData.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Performance Distribution</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
<div className="bg-white shadow rounded-lg p-5">
  {/* Header + Month Dropdown on same line */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
    <h2 className="text-lg font-semibold">Performance Distribution</h2>

    <div className="relative w-full sm:w-1/3">
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="appearance-none w-full bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9078e2] transition"
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
  </div>

  {loading && <p>Loading...</p>}

  {!loading && (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={performanceData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          nameKey="label"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {performanceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e6e3f4",
            borderRadius: "4px",
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )}
</div>


  );
};

export default PieCharts;
