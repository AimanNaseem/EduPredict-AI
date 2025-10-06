import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BarChart2Icon,
  Award,
  NotepadText,
  CalendarClock,
} from "lucide-react";
const TeacherTop = ({ data }) => {
  return (
    <>
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
              end={data?.total_students || 0}
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
              end={data?.avg_attendance || 0}
              duration={5}
              separator=","
              decimals={1}
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
              end={data?.avg_assignments || 0}
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
              end= {data?.avg_quizzes || 0}
              duration={5}
              separator=","
            />
           
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TeacherTop;
