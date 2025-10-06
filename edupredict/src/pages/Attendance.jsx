import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BarChart2Icon,
  GraduationCapIcon,
  Book,
} from "lucide-react";
import { Overview } from "../components/Tabs/Overview";
import { Courses } from "../components/Tabs/Courses";
import { Student } from "../components/Tabs/Student";
import {
  attendance_course_performance,
  attendance_statistics,
  fetch_attendance_table,
} from "../Api/internal";
import Loader from "../components/Custom/Loader";
import axios from "axios";
const Attendance = () => {
  const [studentData, setStudentData] = useState([])
  const [activeTab, setActiveTab] = useState("attendance");
  const [data, setData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
    role: ''
  });
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }
  

  useEffect(() => {
    const adminToken = localStorage.getItem('admin');
    const teacherToken = localStorage.getItem('teacher');
    const studentToken = localStorage.getItem('student');
  
    const token = adminToken || teacherToken || studentToken;
  
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserData({
          name: decoded.name || '',
          email: decoded.email || '',
          username: decoded.username || '',
          role: decoded.role || ''
        });
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/demographic-summary")
      .then(res => res.json())
      .then(data => setStudentData(data))
      .catch(err => console.error(err));
      setLoading(false);
  }, []);

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await attendance_course_performance();
      if (response.status === 200) {
        const courseData = response.data;
  
        // metrics array exist karta hai?
        const metrics = courseData.metrics || [];
  
        // metrics ke andar se total_courses nikalna (max ya sum)
        const totalCourses =
          metrics.length > 0
            ? Math.max(...metrics.map((m) => m.total_courses || 0))
            : courseData.total_courses || 0;
  
        setTotalCourses(totalCourses);
        setData(courseData);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  
  
  useEffect(() => {
    fetchdata();
  }, []);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user");
        const users = res.data.data || [];

        const teacherCount = users.filter(
          (user) => user.role === "teacher"
        ).length;
        const studentCount = users.filter(
          (user) => user.role === "student"
        ).length;

        setTotalTeachers(teacherCount);
        setTotalStudents(studentCount);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const [selectedCourse, setSelectedCourse] = useState("All");
  const [courses, setCourses] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // const currentRecords = attendanceData.slice(indexOfFirstRecord, indexOfLastRecord);

  // const totalPages = Math.ceil(attendanceData.length / recordsPerPage);

  const filteredData =
    selectedCourse === "All"
      ? attendanceData
      : attendanceData.filter((student) => student.course === selectedCourse);

  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await attendance_statistics();
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch attendance table data
  useEffect(() => {
    const loadAttendance = async () => {
      setLoading(true);
      try {
        const res = await fetch_attendance_table();
        if (res?.data) {
          setAttendanceData(res.data);

          // Extract unique course names
          const uniqueCourses = Array.from(
            new Set(res.data.map((d) => d.course))
          ).filter(Boolean);
          setCourses(["All", ...uniqueCourses]);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "attendance") {
      loadAttendance();
    }
  }, [activeTab]);

  if (loading) return <Loader />;


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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-2"
    >
     <motion.div
  className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-white shadow-sm border border-gray-100"
  variants={itemVariants}
>
  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
    Welcome,{" "}
    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
      {userData.name}
    </span>{" "}
    👋
  </h1>

  <p className="text-gray-600 text-lg leading-relaxed">
    📊 Track your <span className="font-semibold text-indigo-600">attendance </span>  
     and stay on top of your academic journey 🚀
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
            <Book size={32} className="text-[#9078e2]" />
            <div className="text-md text-gray-600">Total Courses</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            {totalCourses}
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
            <GraduationCapIcon size={32} className="text-[#9078e2]" />
            <div className="text-md text-gray-600">Total Student</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            {totalStudents}
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
            <UsersIcon size={32} className="text-[#9078e2]" />
            <div className="text-md text-gray-600">Total Teacher</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">
            {totalTeachers}
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
            <BarChart2Icon size={28} className="text-[#9078e2]" />
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
          <div className="text-3xl font-bold text-[#333333]">87%</div>
        </motion.div>
      </motion.div>
      {/* Tab Navigation */}
      <motion.div
        className="mb-6 bg-white rounded-lg shadow p-2 flex flex-wrap sm:flex-nowrap sm:overflow-x-auto gap-2"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <TabButton
          active={activeTab === "attendance"}
          onClick={() => setActiveTab("attendance")}
          label="Attendance"
        />
        <TabButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          label="Overview"
        />
        <TabButton
          active={activeTab === "courses"}
          onClick={() => setActiveTab("courses")}
          label="Courses"
        />
        <TabButton
          active={activeTab === "students"}
          onClick={() => setActiveTab("students")}
          label="Students"
        />
      </motion.div>

      {/* Tab Content */}
      <motion.div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {activeTab === "attendance" && (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Today's Attendance
              </h2>
              <div className="flex space-x-2">
                <select
                  className="px-3 py-1 border rounded text-sm"
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setCurrentPage(1); // reset to first page when filter changes
                  }}
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {/* 
              <motion.button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Export
              </motion.button> */}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentRecords.map((student, i) => (
                    <motion.tr
                      key={student}
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="px-4 py-3">{student.student_id}</td>
                      <td className="px-4 py-3">{student.student_name}</td>
                      <td className="px-4 py-3">{student.course}</td>
                      <td className="px-4 py-3">
                      {student.status === "Present" ? (
  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
    Present
  </span>
) : student.status === "Absent" ? (
  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
    Absent
  </span>
) : student.status === "Late" ? (
  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
    Late
  </span>
) : null}

                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {student.time}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t">
              <div className="flex-1 flex justify-between sm:hidden mb-3 w-full">
                <motion.button
                  className="px-4 py-2 border rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  Previous
                </motion.button>
                <motion.button
                  className="ml-3 px-4 py-2 border border-indigo-500 rounded text-sm font-medium text-indigo-700 bg-white hover:bg-gray-50"
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  Next
                </motion.button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstRecord + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastRecord, attendanceData.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{attendanceData.length}</span>{" "}
                    results
                  </p>
                </div>

                <div>
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="px-3 py-1 border rounded bg-white text-sm"
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === index + 1
                            ? "bg-[#9078e2] text-white"
                            : "bg-white"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className="px-3 py-1 border rounded bg-white text-sm"
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === "overview" && <Overview />}
        {activeTab === "courses" && <Courses />}
        {activeTab === "students" && <Student data={studentData} />}
      </motion.div>
    </motion.div>
  );
};

const TabButton = ({ active, onClick, label }) => (
  <motion.button
    onClick={onClick}
    className={` flex-1 py-2 px-4 text-sm font-medium rounded-md text-center
    transition-colors duration-200
      ${
        active
          ? "bg-[#9078e2] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
  >
    {label}
  </motion.button>
);

// Tab Button Component
// const TabButton = ({ active, onClick, label }) => (
//   <motion.button
//   onClick={onClick}
//   className={`
//     flex-1 py-2 px-4 text-sm font-medium rounded-md text-center
//     transition-colors duration-200
//     ${active ? 'bg-indigo-400 text-black' : 'text-gray-700'}
//   `}
//   whileHover={
//     !active
//       ? { backgroundColor: '#e0e7ff' } // bg-indigo-100
//       : {}
//   }
//   whileTap={{ scale: 0.97 }}
// >
//   {label}
// </motion.button>
// );

export default Attendance;
