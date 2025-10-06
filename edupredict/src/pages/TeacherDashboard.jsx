import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { academic_performance, teacher_analysis } from "../Api/internal";
import Loader from "../components/Custom/Loader";
import TeacherTop from "../components/Tabs/TeacherTop";
import PieCharts from "../components/Custom/PieChart";
import CountUp from "react-countup";
import axios from "axios";
import {
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BarChart2Icon,
  Award,
  NotepadText,
  CalendarClock,
} from "lucide-react";

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

const TeacherDashboard = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [data, setData] = useState({
    batch_id: "",
    course: "",
    months: [],
    selectedMonth: "",
    totalRecords: 0,
    AverageAttendance: "",
    AverageAssignments: "",
    AverageQuizzes: "",
    stddata: [],
  });
  const [userData, setUserData] = useState({
    name: "",
    batch_id: "",
    courses: "",
  });

  console.log(userData);
  // ===== Get teacher info from token =====
  // ===== Load user info from localStorage =====
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
  // ===== Fetch teacher data =====
  // ===== Fetch Teacher Data =====
  // Fetch data
  const fetchTeacherData = async (month = "") => {
    const tokenString = localStorage.getItem("teacher");
    if (!tokenString) return console.error("No token found!");

    const teacherData = JSON.parse(tokenString);
    const token = teacherData.token;
    const url = month
      ?  `http://localhost:8000/api/teacher/data?month=${month}`
      : `http://localhost:8000/api/teacher/data`;

    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}`},
      });

      setData(res.data); // data update
      console.log(data);
      setMonths(res.data.months || []);
      setSelectedMonth(month); // selected month update
      console.log("Fetched data:", res.data); // sahi jagah console.log
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== Fetch once userData loaded =====
  useEffect(() => {
    if (userData?.name) fetchTeacherData();
  }, [userData]);

  // Handle month change
  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    fetchTeacherData(month); // month = "" -> all records
  };
  useEffect(() => {
    // Backend API se data fetch
    axios
      .get("http://localhost:8000/api/student") // 👈 tumhare backend ka route
      .then((res) => {
        setStudents(res.data.data.slice(0, 5)); // 👈 sirf pehle 5 records
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, []);

  // Load recent analyses from localStorage
  // useEffect(() => {
  //   const history = JSON.parse(localStorage.getItem('studentHistory') || '[]');
  //   setRecentAnalyses(history.slice(0, 3));
  // }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await teacher_analysis();
      if (res.status == 200) {
        setCourseData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || courseData == null) {
    return <Loader />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white shadow-md border border-gray-200"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Section: Welcome Message */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 flex-wrap">
              Welcome,
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {userData?.name || "User"}
              </span>
              👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg leading-relaxed">
              📊 Manage{" "}
              <span className="font-semibold text-purple-600">students</span>,
              track <span className="font-semibold text-pink-600">courses</span>
              , and boost academic success 🚀
            </p>
          </div>

          {/* Right Section: Month Selector */}
          <div className="flex items-center gap-2">
            <label className="font-medium hidden sm:block">Select Month:</label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9078e2]"
            >
              <option value="">All</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon size={32} className="text-[#9078e2]" />
            <div className="text-md text-gray-600">Total Students</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            <CountUp
              end={data ? data.totalRecords : "--"}
              duration={5}
              separator=","
            />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <CalendarClock size={32} className="text-[#9078e2]" />
            <div className="text-md text-gray-600">Avg_Attendance</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            <CountUp
              end={parseFloat(data ? data.AverageAttendance : "--")}
              duration={5}
              separator=","
              decimals={2}
              suffix="%"
            />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Award size={32} className="text-[#9078e2]" />
            <div className="text-md text-gray-600">Assignments</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            <CountUp
              end={data ? data.AverageAssignments : "--"}
              duration={5}
              separator=","
            />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <NotepadText size={32} className="text-[#9078e2]" />
            <div className="text-md text-gray-600">Quizzes</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            <CountUp
              end={data ? data.AverageQuizzes : "--"}
              duration={5}
              separator=","
            />
          </div>
        </motion.div>
      </motion.div>

      {/* <TeacherTop data={courseData.summary_metrics} /> */}

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {/* Recent Analyses Table */}
        <motion.div
          className="bg-white p-5 rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-lg font-semibold mb-4">Student Month History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch_id
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.stddata?.length > 0 ? (
                  data.stddata.slice(0, 5).map((analysis, index) => (
                    <tr key={index}>
                      {/* Student ID */}

                      {/* Student Name */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {analysis.Name}
                      </td>

                      {/* Batch */}
                      <td className="px-4 py-3 ">{analysis.batch_id}</td>
                      <td className="px-4 py-3">{analysis.month}</td>

                      {/* Predicted Performance */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            {
                              Excellent: "bg-green-100 text-green-800",
                              Good: "bg-green-100 text-green-800",
                              Average: "bg-yellow-100 text-yellow-800",
                              "Below Average": "bg-red-100 text-red-800",
                            }[analysis.predicted_performance] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {analysis.predicted_performance || "N/A"}
                        </span>
                      </td>

                      {/* Dropout Risk */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            {
                              Low: "bg-green-100 text-green-800",
                              Medium: "bg-yellow-100 text-yellow-800",
                              High: "bg-red-100 text-red-800",
                            }[analysis.dropout_risk] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {analysis.dropout_risk || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-3 text-center text-sm text-gray-500"
                    >
                      No student data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Risk Distribution Chart */}
        {/* <motion.div className="bg-white p-5 rounded-lg shadow-md" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">High Risk</span>
                <span className="text-sm font-medium text-gray-700">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                <span className="text-sm font-medium text-gray-700">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Low Risk</span>
                <span className="text-sm font-medium text-gray-700">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </motion.div> */}
        <PieCharts />
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboard;