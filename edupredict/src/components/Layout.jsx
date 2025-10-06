import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
const Layout = ({
  children
}) => {
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);
  return <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />
      <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </motion.main>
    </div>;
};
export default Layout;