import React from 'react'
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BarChart2Icon,
  CalendarClock,
  Award,
  NotepadText
} from "lucide-react";
const StudentTop = ({ data }) => {
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
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
        <NotepadText size={32} className="text-[#9078e2]" />
        <div className="text-md text-gray-600">Quizzes</div>
      </div>
      <div className="text-3xl font-bold text-[#333333]">{data?.avg_quizzes.toFixed()}</div>
    </motion.div>
  
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
      <CalendarClock size={32} className="text-[#9078e2]" />
        <div className="text-md text-gray-600">Attendance</div>
      </div>
      <div className="text-3xl font-bold text-[#333333]">{data?.avg_attendance.toFixed(1)}%</div>
    </motion.div>
  
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
        <XCircleIcon size={30} className="text-[#9078e2]" />
        <div className="text-md text-gray-600">Gpa</div>
      </div>
      <div className="text-3xl font-bold text-[#333333]">{data?.avg_gpa.toFixed(1)}</div>
    </motion.div>
  
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#9078e2] hover:shadow-lg transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-3 mb-2">
        <Award size={30} className="text-[#9078e2]" />
        <div className="text-md text-gray-600">Assignment</div>
      </div>
      <div className="text-3xl font-bold text-[#333333]">{data?.avg_assignments.toFixed()}</div>
    </motion.div>
  </motion.div>
  </>
  )
}

export default StudentTop