import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { motion } from 'framer-motion';
import Chatbot from "../../pages/Chatbox";
const AuthLayout = ({ token, children }) => {
  const auth = localStorage.getItem(token);
  const expiry = localStorage.getItem("token_expiry");

  // Check if token expired
  const isExpired = expiry && Date.now() > Number(expiry);

  // Auto logout timer
  useEffect(() => {
    if (expiry) {
      const remainingTime = Number(expiry) - Date.now();
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("token_expiry");
          window.location.href = "/"; // force redirect after expiry
        }, remainingTime);

        return () => clearTimeout(timer);
      }
    }
  }, [expiry]);

  if (auth && !isExpired) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-[#f1eff9]">
        <Sidebar /> {/* Sidebar left side */}
        <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} className="flex-1 p-4 md:p-6 overflow-auto">
        {children}

        <Chatbot />

      </motion.main>
      </div>
    );
  } else {
    localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");
  return <Navigate to="/" />;
  }
};


export default AuthLayout;
