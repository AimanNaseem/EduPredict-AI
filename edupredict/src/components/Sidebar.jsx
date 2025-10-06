import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineAppstore, AiOutlineHome } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { GrPieChart } from "react-icons/gr";
import { MdMenu } from "react-icons/md";
import { RiLoginBoxLine } from "react-icons/ri";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Award,
  Book,
  BookOpenIcon,
  CalendarClock,
  ChartColumnBig,
  ChartLine,
  ChartSpline,
  History,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  NotepadText,
  Settings,
  Users,
  UserX,
  MegaphoneIcon,
  BellIcon,
  File,
} from "lucide-react";
import Feedbackform from "./../pages/Feedbackform";
import AnnounceForm from "../pages/AnnounceForm";
import NotificationPopup from "../pages/Notifications";

const Sidebar = () => {
  const isTabletMid = window.innerWidth <= 768;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [open, setOpen] = useState(!isTabletMid);
  const sidebarRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isTabletMid) setOpen(false);
  }, [pathname]);

  const admin_token = localStorage.getItem("admin");
  const teacher_token = localStorage.getItem("teacher");
  const student_token = localStorage.getItem("student");

  const Nav_animation = {
    open: { x: 0, width: "16rem", transition: { damping: 40 } },
    closed: { x: -250, width: 0, transition: { damping: 40, delay: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const handleLogout = async () => {
    try {
      // Get raw token from localStorage
      const rawToken =
        localStorage.getItem("admin") ||
        localStorage.getItem("teacher") ||
        localStorage.getItem("student");

      if (!rawToken) return console.error("No token found in storage");

      // Handle both string and JSON object format
      const token = rawToken.startsWith("{")
        ? JSON.parse(rawToken).token
        : rawToken;

      if (!token) return console.error("Invalid token format");

      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Logout failed");
      }

      // ✅ Clear all role-specific tokens
      localStorage.removeItem("admin");
      localStorage.removeItem("teacher");
      localStorage.removeItem("student");

      navigate("/login");
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err.message);
      alert(`Logout failed: ${err.message}`);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md z-10">
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50"
          />
        )}
        <motion.div
          ref={sidebarRef}
          variants={Nav_animation}
          initial={isTabletMid ? { x: -250 } : { x: 0 }}
          animate={open ? "open" : "closed"}
          className="bg-white text-gray z-[999] max-w-[16rem] w-[16rem] overflow-x-auto md:relative fixed h-screen shadow-xl"
        >
          {/* Logo */}
          <div className="gradient-bg flex items-center gap-2.5 font-medium py-4 border-slate-300 mx-3 rounded-b-xl mb-4">
            <motion.div
              className="flex items-center justify-center rounded-full p-1 ml-3 w-10 h-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpenIcon size={35} className="text-white" />
            </motion.div>
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold whitespace-pre text-white"
                >
                  EduNex-AI
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Menu */}
          <motion.ul
            className="whitespace-pre px-2.5 text-[0.9rem] py-2 flex flex-col gap-2 font-medium overflow-hidden "
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {!admin_token && !teacher_token && !student_token && (
              <>
                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/login"
                    className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <RiLoginBoxLine size={23} />
                    {open && <span>Login</span>}
                  </NavLink>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/register"
                    className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <RiLoginBoxLine size={23} />
                    {open && <span>Register</span>}
                  </NavLink>
                </motion.li>
              </>
            )}

            {admin_token && (
              <>
                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/attendance"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <LayoutDashboard size={26} />
                    Dashboard
                  </NavLink>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/usermanagement"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Users size={26} />
                    User Management
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/studentattendance"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <CalendarClock size={30} />
                    {open && <span>Attendance</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/studentquiz"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <NotepadText size={30} />
                    {open && <span>Quiz</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/assignment"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Award size={30} />
                    {open && <span>Assignment</span>}
                  </NavLink>
                </motion.li>





                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/dataset"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <File size={26} />
                    {open && <span>Dataset</span>}
                  </NavLink>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/prediction"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <ChartColumnBig size={26} />
                    {open && <span>Prediction</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/feedback"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <MessageSquare size={26} />
                    Feedback
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <MegaphoneIcon size={30} /> {/* <-- Replaced MessageSquare with Megaphone */}
                    {open && <span>Make Announcement</span>}
                  </NavLink>
                </motion.li>
                {isModalOpen && (
                  <AnnounceForm onClose={() => setIsModalOpen(false)} />
                )}

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/setting"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Settings size={26} />
                    Settings
                  </NavLink>
                </motion.li>
              </>
            )}

            {student_token && (
              <>
                <motion.li variants={itemVariants} className="mt-2">
                  {open && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-gray-400 px-2 mb-1 uppercase"
                    >
                      Student Portal
                    </motion.div>
                  )}
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/studentdashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <LayoutDashboard size={30} />
                    {open && <span>Dashboard</span>}
                  </NavLink>
                </motion.li>

                {/* <motion.li variants={itemVariants}>
                  <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${
                        isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'
                      }`
                    }
                  >
                    <Book size={26} />
                    {open && <span>Courses</span>}
                  </NavLink>
                </motion.li> */}

               

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/analysis"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <ChartLine size={30} />
                    {open && <span>Student Analysis</span>}
                  </NavLink>
                </motion.li>


                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <MessageSquare size={30} />
                    {open && <span>Send Feedback</span>}
                  </NavLink>
                </ motion.li>
                {isModalOpen && (
                  <Feedbackform onClose={() => setIsModalOpen(false)} />
                )}


                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNotificationOpen(true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive ? "sidebar-link-active font-bold" : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <BellIcon size={30} />
                    {open && <span>Notifications</span>}
                  </NavLink>
                </motion.li>


                {isNotificationOpen && (
                  <NotificationPopup onClose={() => setIsNotificationOpen(false)} />
                )}


                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Settings size={30} />
                    {open && <span>Settings</span>}
                  </NavLink>
                </motion.li>
              </>
            )}

            {teacher_token && (
              <>
                <motion.li variants={itemVariants} className="mt-2">
                  {open && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-gray-400 px-2 mb-1 uppercase"
                    >
                      Teacher Portal
                    </motion.div>
                  )}
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/teacherdashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <LayoutDashboard size={30} />
                    {open && <span>Dashboard</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/teacherattendence"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <CalendarClock size={30} />
                    {open && <span>Attendance</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/teacherquiz"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <NotepadText size={30} />
                    {open && <span>Quiz</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/teacherassignment"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Award size={30} />
                    {open && <span>Assignment</span>}
                  </NavLink>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/dropout"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <UserX size={30} />
                    {open && <span>Dropout Risk</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/stdperformance"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <ChartSpline size={30} />
                    {open && <span>Student Performance</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/demands"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <ChartColumnBig size={30} />
                    {open && <span>Course Demand</span>}
                  </NavLink>
                </motion.li>

                {/* <motion.li variants={itemVariants}>
                  <NavLink
                    to="/feedbackteac"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <MessageSquare size={30} />
                    {open && <span>Feedback</span>}
                  </NavLink>
                </motion.li> */}

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/stdhistory"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <History size={30} />
                    {open && <span>Student History</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNotificationOpen(true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive ? "sidebar-link-active font-bold" : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <BellIcon size={30} />
                    {open && <span>Notifications</span>}
                  </NavLink>
                </motion.li>


                {isNotificationOpen && (
                  <NotificationPopup onClose={() => setIsNotificationOpen(false)} />
                )}


                <motion.li variants={itemVariants}>
                  <NavLink
                    to="/settingteacher"
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-2.5 rounded-lg transition-all ${isActive
                        ? "sidebar-link-active font-bold"
                        : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <Settings size={30} />
                    {open && <span>Settings</span>}
                  </NavLink>
                </motion.li>
              </>
            )}

            {(admin_token || student_token || teacher_token) && (
              <motion.li variants={itemVariants} className="mt-auto mb-3">
                <div
                  className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut size={26} />
                  {open && <span>Logout</span>}
                </div>
              </motion.li>
            )}
          </motion.ul>
        </motion.div>

        {/* Mobile menu button */}
        <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <MdMenu size={25} className="text-indigo-600" />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
