import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import LMS from "./pages/LMS";
import Demographics from "./pages/Demographics";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AuthLayout from "./components/Custom/AuthLayout";
import Redirect from "./pages/Redirect";
import UserManagement from "./pages/UserManagement";
import Register from "./pages/Register";
import Dataset from "./pages/Dataset";
import Setting from "./pages/Setting";
import Feedback from "./pages/Feedback";
import StudentAttendance from "./pages/StudentAttendence";
import Quiz from "./pages/Quiz";
import FeedbackTeac from "./pages/FeedbackTeac";
import Dropout_risk from "./pages/Dropout_risk";
import Course_demand from "./pages/Course_demand";
import Stdperform from "./pages/Stdperform";
import { ToastContainer } from "react-toastify";
import StudentAnalysis from "./pages/StudentAnalysis";
import StudentHistory from "./pages/StudentHistory";
import Assignment from "./pages/Assignment";
import Otpverify from "./pages/Otpverify";
import Prediction from "./pages/Prediction";
import Guestlayout from "./components/Custom/GuestLayout";
import { About } from "./theme/About";
import Contact from "./theme/Contact";
import Home1 from "./theme/Home1";
import { ChatbotProvider } from "./components/Chatbot/ChatbotContext";
import TeacherQuiz from "./pages/teacherquiz";
import Teacherattendance from "./pages/Teacherattendance";
import TeacherAssignment from "./pages/TeacherAssignment";
import StudentDropout from "./pages/StudentDropout";


export function App() {
  // For demo purposes, we'll add state to toggle between user roles
  const [userRole, setUserRole] = useState("none");
  // Set up mock login functionality
  const handleLogin = (role) => {
    localStorage.setItem(role, "token");
    setUserRole(role);
  };
  // Set up mock logout functionality
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("teacher");
    localStorage.removeItem("student");
    setUserRole("none");
  };
  return (
    <>
     {/* <ChatbotProvider>          ✅ Wrap the entire app */}
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex flex-col h-screen">
          <AnimatePresence mode="wait">
            
              <Routes>
                <Route path="/" element={<Guestlayout><Home1/></Guestlayout>} />
                <Route path="/about" element={<Guestlayout><About /></Guestlayout>} />
                <Route path="/contact" element={<Guestlayout><Contact /></Guestlayout>} />
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/otp" element={<Otpverify />} />

                <Route
                  path="/attendance"
                  element={
                    <AuthLayout token={"admin"}>
                      <Attendance />
                    </AuthLayout>
                  }
                />
                  <Route
                  path="/stddropout"
                  element={
                    <AuthLayout token={"admin"}>
                      <StudentDropout/>
                    </AuthLayout>
                  }
                />
                      <Route
                  path="/studentattendance"
                  element={
                    <AuthLayout token={"admin"}>
                      <StudentAttendance />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/studentquiz"
                  element={
                    <AuthLayout token={"admin"}>
                      <Quiz />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/assignment"
                  element={
                    <AuthLayout token={"admin"}>
                      <Assignment />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/prediction"
                  element={
                    <AuthLayout token={"admin"}>
                      <Prediction />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/usermanagement"
                  element={
                    <AuthLayout token={"admin"}>
                      <UserManagement />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/dataset"
                  element={
                    <AuthLayout token={"admin"}>
                      <Dataset />
                    </AuthLayout>
                  }
                />
              
                <Route
                  path="/history"
                  element={
                    <AuthLayout token={"admin"}>
                      <StudentHistory />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/feedbackteac"
                  element={
                    <AuthLayout token={"teacher"}>
                      <FeedbackTeac />
                    </AuthLayout>
                  }
                />
               
                <Route
                  path="/feedback"
                  element={
                    <AuthLayout token={"admin"}>
                      <Feedback />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/setting"
                  element={
                    <AuthLayout token={"admin"}>
                      <Setting />
                    </AuthLayout>
                  }
                />

                {/* ========================Student Routes ============================== */}

                <Route
                  path="/studentdashboard"
                  element={
                    <AuthLayout token={"student"}>
                      <StudentDashboard />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/analysis"
                  element={
                    <AuthLayout token={"student"}>
                      <StudentAnalysis />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AuthLayout token={"student"}>
                      <Setting />
                    </AuthLayout>
                  }
                />

                {/* ========================Teacher Routes ============================== */}

                <Route
                  path="/teacherdashboard"
                  element={
                    <AuthLayout token={"teacher"}>
                      <TeacherDashboard />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/teacherquiz"
                  element={
                    <AuthLayout token={"teacher"}>
                      <TeacherQuiz />
                    </AuthLayout>
                  }
                />
                  <Route
                  path="/teacherattendence"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Teacherattendance />
                    </AuthLayout>
                  }
                />
                  <Route
                  path="/teacherassignment"
                  element={
                    <AuthLayout token={"teacher"}>
                      <TeacherAssignment />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/dropout"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Dropout_risk />
                    </AuthLayout>
                  }
                />
           

                <Route
                  path="/stdperformance"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Stdperform />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/demands"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Course_demand />
                    </AuthLayout>
                  }
                />
                  <Route
                  path="/teacherquiz"
                  element={
                    <AuthLayout token={"teacher"}>
                      <TeacherQuiz />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/feedbacks"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Feedback />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/stdhistory"
                  element={
                    <AuthLayout token={"teacher"}>
                      <StudentHistory />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/settingteacher"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Setting />
                    </AuthLayout>
                  }
                />
              </Routes>
            
          </AnimatePresence>
        </div>
      </BrowserRouter>
     {/* </ChatbotProvider>  */}
    </>
  );
}
export default App;
