import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon, SearchIcon, TrashIcon } from 'lucide-react';
import axios from 'axios';


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




const StudentHistory = () => {
  const [students, setStudents] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      ? `http://localhost:8000/api/teacher/data?month=${month}`
      : `http://localhost:8000/api/teacher/data`;

    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
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



  // Load history from localStorage on component mount
  // 1️⃣ Fetch student history from backend
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/student"); // 👈 backend endpoint
      if (res.data && res.data.data) {
        setStudents(res.data.data);
        setFilteredData(res.data.data); // initially same as full list
      }
      // setLoading(false);
    } catch (err) {
      console.error("Error fetching student history:", err);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 2️⃣ Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setData(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.Name.toLowerCase().includes(term) ||
          item.student_id.toLowerCase().includes(term)
      );
      setData(filtered);
    }
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
    if (filteredData.length > 0) {
      downloadCSV(filteredData, `Student_History_${today}.csv`);
    } else {
      downloadCSV(filteredData, `Student_History_${today}.csv`);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
  
    // Agar "22:32.9" type string hai
    const [hours, rest] = timeString.split(":");
    const [minutes, seconds] = rest.split(".");
    
    // 24-hour se 12-hour format (optional)
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;
  
    return `${hh.toString().padStart(2,"0")}:${minutes.padStart(2,"0")} ${ampm}`;
  };
  

  // Clear all history
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('studentHistory');
      setHistoryData([]);
      setFilteredData([]);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2 items-start sm:items-center mb-4">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Student History</h1>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none w-full sm:w-auto bg-white px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9078e2] transition"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
          <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="appearance-none w-full sm:w-auto bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9078e2] transition"
            >
             
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
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

          <button 
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#9078e2] text-white font-medium hover:bg-[#7c64d4] transition w-full sm:w-auto">
             <DownloadIcon size={16} />
             <span>Download</span>
          </button>
        </div>
      </div>
      {data.stddata?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No history found. Complete an analysis to see results here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropout Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.stddata?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.student_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.gpa}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.predicted_performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                        item.predicted_performance === 'Good' ? 'bg-green-100 text-green-800' :
                        item.predicted_performance === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                        item.predicted_performance === 'Below Average' ? 'bg-red-100 text-red-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.predicted_performance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.dropout_risk === 'Low' ? 'bg-green-100 text-green-800' :
                        item.dropout_risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.dropout_risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatTime(item.timestamp)}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <Link to="/student-analysis">View Details</Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredData.length}</span> results
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentHistory;