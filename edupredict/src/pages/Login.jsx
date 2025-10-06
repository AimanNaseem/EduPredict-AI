import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, GraduationCapIcon, UserIcon } from 'lucide-react';
import { create_credentials, login } from "../Api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    createWebUsers();
  }, []);

  const createWebUsers = async () => {
    const response = await create_credentials();
    if (response?.status === 200) {
      console.log(response.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!email || !password) {
      toast.error("Enter required fields");
      setLoading(false);
      return;
    }
  
    let role = "admin";
    if (isStudent) role = "student";
    else if (isTeacher) role = "teacher";
  
    const data = { email, password, role };
    const response = await login(data);
  
    if (response?.status === 200) {
      const { token, student, courses } = response.data;
  
      // ⏳ expiry time add
      const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
  
      if (role === "student") {
        localStorage.setItem(
          "student",
          JSON.stringify({ token, student, expiry })
        );
      } else if (role === "teacher") {
        const { token, teacher } = response.data; // teacher object destructure
        localStorage.setItem(
          "teacher",
          JSON.stringify({
            token,
            batch_id: teacher?.batch_id,
            courses: teacher?.courses,
            expiry: Date.now() + 60 * 60 * 1000
          })
        );
      } else if (role === "admin") {
        localStorage.setItem("admin", JSON.stringify({ token, expiry }));
      }
  
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Invalid credentials");
    }
  
    setLoading(false);
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#9078e2] p-12 flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center"
        >
          <BookOpenIcon size={40} className="text-white" />
          <span className="text-white text-3xl font-bold ml-2">EduNex AI</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white"
        >
          <h2 className="text-4xl font-bold mb-6">Unlock the power of AI in education</h2>
          <p className="text-xl opacity-80">
            Access your analytics dashboard to transform the way you teach and learn.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <GraduationCapIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Personalized learning experiences</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <UserIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Student progress tracking</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <BookOpenIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Data-driven teaching insights</p>
            </div>
          </div>
        </motion.div>

        <div className="text-white/60 text-sm">© 2025 EduNex AI. All rights reserved.</div>
      </div>

      {/* Right Panel */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="w-full max-w-md">
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="lg:hidden flex items-center justify-center mb-4">
              <BookOpenIcon size={32} className="text-[#9078e2]" />
              <span className="text-2xl font-bold ml-2 text-[#9078e2]">EduNex AI</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue to your dashboard</p>
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Select Account Type:</span>
                {(isStudent || isTeacher) && (
                  <button
                    type="button"
                    className="text-[#9078e2] text-sm hover:text-blue-800"
                    onClick={() => {
                      setIsStudent(false);
                      setIsTeacher(false);
                    }}
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    isTeacher && 'border-[#9078e2] bg-[#f0ecfd] text-[#9078e2]'
                  }`}
                  onClick={() => {
                    setIsStudent(false);
                    setIsTeacher(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isTeacher ? 'bg-white' : 'bg-gray-100'}`}>
                    <UserIcon size={30} className={isTeacher ? 'text-[#9078e2]' : ''} />
                  </div>
                  <span className={`font-medium ${isTeacher ? 'text-[#9078e2]' : ''}`}>Teacher</span>
                </motion.button>

                <motion.button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    isStudent && 'border-[#9078e2] bg-[#f0ecfd] text-[#9078e2]'
                  }`}
                  onClick={() => {
                    setIsTeacher(false);
                    setIsStudent(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isStudent ? 'bg-white' : 'bg-gray-100'}`}>
                    <GraduationCapIcon size={30} className={isStudent ? 'text-[#9078e2]' : ''} />
                  </div>
                  <span className={`font-medium ${isStudent ? 'text-[#9078e2]' : ''}`}>Student</span>
                </motion.button>
              </div>

              {!isStudent && !isTeacher && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  No selection will default to Admin login
                </p>
              )}
            </motion.div>

            {/* Email */}
             <motion.div variants={itemVariants}>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
      Email Address
    </label>
    <motion.input
      type="email"
      name="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="you@example.com"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
      whileFocus={{ scale: 1.01 }}
      required
      // pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      // title="Please enter a valid email address (e.g. user@example.com)"
    />
  </motion.div>

            {/* Password */}
          <motion.div variants={itemVariants}>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
    Password
  </label>
  <motion.input
    type="password"
    name="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
    whileFocus={{ scale: 1.01 }}
    required
    // minLength={6}
    // maxLength={20}
    // pattern="^(?=.*[A-Za-z])(?=.*[0-9]).{6,}$"
    // title="Password must be at least 6 characters long and contain at least one letter and one number"
  />
</motion.div>
{/* "Don't have an account? Register" link */}
<motion.div variants={itemVariants} className="text-center mt-2">
  <span className="text-gray-600 text-sm">
    Don't have an account?{" "}
    <button
      type="button"
      onClick={() => navigate("/register")} // or your page-switch logic
      className="text-[#9078e2] font-medium hover:underline"
    >
      Register
    </button>
  </span>
</motion.div>
            {/* Submit */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#9078e2] hover:bg-[#9078e2] text-white rounded-lg font-medium shadow-sm disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Logging in..." : "Login to your account"}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
