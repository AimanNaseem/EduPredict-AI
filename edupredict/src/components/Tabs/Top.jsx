import React from 'react'
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BarChart2Icon
} from "lucide-react";
const Top = ({ data }) => {
  return (
    <>
    <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }}
  >
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
        <UsersIcon size={28} className="text-green-600" />
        <div className="text-sm text-gray-600">Total Students</div>
      </div>
      <div className="text-3xl font-extrabold text-green-600">{data?.total_students}</div>
    </motion.div>
  
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
        <CheckCircle2Icon size={28} className="text-blue-600" />
        <div className="text-sm text-gray-600">Present Today</div>
      </div>
      <div className="text-3xl font-extrabold text-blue-600">{data?.avg_attendance.toFixed(1)}%</div>
    </motion.div>
  
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
        <XCircleIcon size={28} className="text-red-600" />
        <div className="text-sm text-gray-600">Absent Today</div>
      </div>
      <div className="text-3xl font-extrabold text-red-600">{data?.avg_gpa.toFixed(2)}</div>
    </motion.div>
  
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
        <BarChart2Icon size={28} className="text-yellow-600" />
        <div className="text-sm text-gray-600">Attendance Rate</div>
      </div>
      <div className="text-3xl font-extrabold text-yellow-600">  {data?.avg_quizzes.toFixed(0)}%</div>
    </motion.div>
  </motion.div>
  </>
  )
}

export default Top