import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import StudentTop from "../components/Tabs/StudentTop";
import { Link, useNavigate } from "react-router-dom";
import {
  attendance_course_performance,
  teacher_analysis,
} from "../Api/internal";
import Loader from "../components/Custom/Loader";
import axios from "axios";
import { Award, CalendarClock, GraduationCap, NotepadText, XCircleIcon } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [student, setStudent] = useState(null);
  const [record, recordData] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
  });

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

  useEffect(() => {
    const adminToken = localStorage.getItem("admin");
    const teacherToken = localStorage.getItem("teacher");
    const studentToken = localStorage.getItem("student");

    const token = adminToken || teacherToken || studentToken;

    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserData({
          name: decoded.name || "",
          email: decoded.email || "",
          username: decoded.username || "",
          role: decoded.role || "",
        });
      }
    }
  }, []);

  const attendanceData = async () => {
    setLoading(true);
    try {
      const response = await attendance_course_performance(); // fetch data
      if (response.status === 200) {
        const metrics = response.data.metrics || [];

        // Keep only the latest record per course
        const uniqueCoursesMap = {};
        metrics.forEach((item) => {
          // If course is not added yet or the month is later, update it
          if (
            !uniqueCoursesMap[item.course] ||
            new Date(item.month) > new Date(uniqueCoursesMap[item.course].month)
          ) {
            uniqueCoursesMap[item.course] = item;
          }
        });

        // Convert map to array and take only first 5 courses
        const uniqueCourses = Object.values(uniqueCoursesMap).slice(0, 5);

        // Prepare data for chart
        const chartData = uniqueCourses.map((item) => ({
          course: item.course,
          avg_attendance: item.avg_attendance,
          avg_quizzes: item.avg_quizzes,
          avg_assignment: item.avg_assignment,
          month: item.month,
        }));

        recordData(chartData);
      }
    } catch (error) {
      console.error("Error fetching attendance data", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    attendanceData();
  }, []);

  const dropData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/dropout_risk_percentage"
      );
      if (res.status === 200) {
        // Remove duplicates
        const unique = res.data.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.Course === item.Course && t.teacher_name === item.teacher_name
            )
        );

        const formatted = unique.map((item) => ({
          course: item.Course,
          teacher: item.teacher_name,
          risk: item.risk_level,
        }));

        setData(formatted.slice(0, 5)); // Only first 5 unique records
      }
    } catch (error) {
      console.log("Error fetching dropout risk data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dropData();
  }, []);

  // const quizData = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:3001/quiz-summary");
  //     if (res.status === 200) {
  //       // Remove duplicates based on course_id and teacher_name
  //       const unique = res.data.filter(
  //         (item, index, self) =>
  //           index ===
  //           self.findIndex(
  //             (t) =>
  //               t.course_id === item.course_id &&
  //               t.teacher_name === item.teacher_name
  //           )
  //       );

  //       // Format the data
  //       const format = unique.map((item) => ({
  //         course: item.course_id,
  //         teacher: item.teacher_name,
  //         quiz: item.quizzes_completed,
  //       }));

  //       setData(format.slice(0, 4)); // Only first 7 unique records
  //     }
  //   } catch (error) {
  //     console.log("Error fetching quiz summary:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   quizData();
  // }, []);

  const riskColor = {
    Low: "bg-green-200 text-green-800",
    Medium: "bg-orange-200 text-orange-800",
    High: "bg-red-200 text-red-800",
  };



  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("student");
        if (!token) return;

        const decoded = parseJwt(token); // 👈 token parse
        if (!decoded || !decoded.student_id) return;

        const res = await axios.get(
          `http://localhost:8000/api/student/${decoded.student_id}`, // backend me student_id ke basis pe fetch
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data && res.data.data) {
          setStudent(res.data.data); // object assign karo
        }

        console.log("Decoded token:", decoded);
        console.log("Student data:", res.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudent();
  }, []);

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
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <>
      <motion.div
        className="p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-white shadow-sm border border-gray-100"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {userData.name}
            </span>{" "}
            👋
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            🎓 Ready to take control of your learning journey? This is your{" "}
            <span className="font-semibold text-indigo-600">
              Student Dashboard
            </span>
            , where progress meets opportunity 🚀
          </p>
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
              <NotepadText size={32} className="text-[#9078e2]" />
              <div className="text-md text-gray-600">Quizzes</div>
            </div>
            <div className="text-3xl font-bold text-[#333333]">
              <CountUp
                end={student ? student.quizzes_completed : "--"}
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
              <div className="text-md text-gray-600">Attendance</div>
            </div>
            <div className="text-3xl font-bold text-[#333333]">
              <CountUp
                end={student ? student.attendance_percentage : 0} // number
                duration={5}
                separator=","
                decimals={1} // agar decimal chahiye
                suffix="%" // yahan % add hoga
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
              <GraduationCap size={30} className="text-[#9078e2]" />
              <div className="text-md text-gray-600">Gpa</div>
            </div>
            <div className="text-3xl font-bold text-[#333333]">
              <CountUp
                end={student ? student.gpa : "--"} // number
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
              <Award size={30} className="text-[#9078e2]" />
              <div className="text-md text-gray-600">Assignment</div>
            </div>
            <div className="text-3xl font-bold text-[#333333]">
            
              <CountUp
                end={student ? student.assignments_completed : "--"} // number
                duration={5}
                separator=","
              />
            </div>
          </motion.div>
        </motion.div>


        <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-2 gap-4 mb-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              Your Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <motion.div
                className="p-4 bg-emerald-100 rounded-lg border border-emerald-100"
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="text-emerald-800 font-semibold mb-1">
                  Dropout_Risk
                </div>
                <div className="text-3xl font-bold text-emerald-600">
                  {student ? student.dropout_risk : "--"}
                </div>
              </motion.div>
              <motion.div
                className="p-4 bg-blue-100 rounded-lg border border-blue-100"
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="text-blue-800 font-semibold mb-1">
                  Student Performance
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {student ? student.predicted_performance : "--"}
                </div>
              </motion.div>
              <motion.div
                className="p-4 bg-red-100 rounded-lg border border-red-100"
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="text-red-700 font-semibold mb-1">
                  Previous Failures
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {student ? student.previous_failures : "--"}
                </div>
              </motion.div>
              <motion.div
                className="p-4 bg-purple-100 rounded-lg border border-purple-100"
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="text-purple-800 font-semibold mb-1">
                  LMS Engagement Score
                </div>
                <div className="text-3xl font-bold text-purple-600">
                <CountUp
                end={student ? student.lms_engagement_score : "--"}// number
                duration={5}
                separator=","
                suffix="%"
              />
                 
                </div>
              </motion.div>
            </div>
          </motion.div>


        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
              Attendance Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={record} // use transformed data
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 80]} />
                <YAxis
                  type="category"
                  dataKey="course"
                  width={100}
                  tick={{ fontSize: 15 }}
                />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Bar
                  dataKey="avg_attendance" // show only avg attendance
                  fill="#9078e2"
                  radius={[0, 6, 6, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* <motion.div
              className="mt-4 pt-4 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link to="/studentattendance" className="w-full block">
                  View All
                </Link>
              </motion.button>
            </motion.div> */}
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
              Dropout Risk
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Teacher
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Dropout Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-2 text-gray-800  border-b border-gray-200">
                        {item.course}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-b border-gray-200">
                        {item.teacher}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-b border-gray-200">
                          <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    riskColor[item.risk]
                  }`}
                >
                  {item.risk}
                </span>                
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* <motion.div
    className="mt-4 pt-4 border-t"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <motion.button
      className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      View All Courses
    </motion.button>
  </motion.div> */}
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              Quiz Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={record} // use transformed data
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 45]} />
                <YAxis
                  type="category"
                  dataKey="course"
                  width={100}
                  tick={{ fontSize: 15 }}
                />
                <Tooltip />
                <Bar
                  dataKey="avg_quizzes" // show only avg attendance
                  fill="#a48fe6"
                  radius={[0, 6, 6, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* <motion.div
              className="mt-4 pt-4 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link to="/studentattendance" className="w-full block">
                  View All
                </Link>
              </motion.button>
            </motion.div> */}
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-sky-400 rounded-full mr-2"></span>
              Assignment Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={record} // use transformed data
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, "dataMax + 5"]} />
                <YAxis
                  type="category"
                  dataKey="course"
                  width={100}
                  tick={{ fontSize: 15 }}
                />
                <Tooltip />
                <Bar
                  dataKey="avg_assignment" // show only avg attendance
                  fill="#c4bef0"
                  radius={[0, 6, 6, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* <motion.div
              className="mt-4 pt-4 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link to="/studentattendance" className="w-full block">
                  View All
                </Link>
              </motion.button>
            </motion.div> */}
          </motion.div>

          {/* <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
              Quiz Overview
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Teacher
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-2 text-gray-800  border-b border-gray-200">
                        {item.course}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-b border-gray-200">
                        {item.teacher}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-b border-gray-200">
                        {item.quiz}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

           <motion.div
    className="mt-4 pt-4 border-t"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <motion.button
      className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      View All Courses
    </motion.button>
  </motion.div>
          </motion.div> */}

          {/* <motion.div
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            Quizzes
          </h2>
          <ul className="divide-y space-y-1">
            {assignments.map((assignment, i) => (
              <motion.li
                key={i}
                className="py-3 flex justify-center items-center"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: i * 0.1,
                }}
                whileHover={{
                  x: 5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === 0
                        ? "bg-red-500"
                        : i === 1
                        ? "bg-amber-500"
                        : "bg-green-500"
                    } mr-2`}
                  ></div>
                  <span className="font-medium">{assignment}</span>
                </div>
                <div className="flex items-center"></div>
              </motion.li>
            ))}
          </ul>
          <motion.div
            className="mt-4 pt-4 border-t"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
          >
            <motion.button
              className="w-full px-4 py-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors duration-200 text-sm font-medium"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate("/studentquiz")} // update route as needed
            >
              View All Assignments
            </motion.button>
          </motion.div>
        </motion.div> */}
         
        </motion.div>
      </motion.div>
    </>
  );
};
export default StudentDashboard;
