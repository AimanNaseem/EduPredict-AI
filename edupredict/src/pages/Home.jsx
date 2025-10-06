import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const admin = localStorage.getItem("admin");
  const teacher = localStorage.getItem("teacher");
  const student = localStorage.getItem("student");
  const navigate = useNavigate();

  if (admin) return <Navigate to="/attendance" />;
  if (teacher) return <Navigate to="/teacherdashboard" />;
  if (student) return <Navigate to="/studentdashboard" />;

  // Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 }
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

  const features = [
    {
      title: 'Track Attendance',
      description: 'Monitor student participation and engagement',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Learning Management',
      description: 'Organize and deliver educational content',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100',
      textColor: 'text-cyan-600'
    },
    {
      title: 'Data Analysis',
      description: 'Gain insights from educational data',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-full py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center max-w-3xl mx-auto px-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-white bg-clip-text gradient-bg">
            Welcome to EduNex-AI
          </h1>
        </motion.div>

        <motion.div className="mb-8 p-6 bg-white rounded-xl shadow-lg" variants={itemVariants}>
          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            An intelligent educational platform to manage attendance, learning
            materials, and predict student success through data-driven insights.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-4 border ${feature.borderColor} rounded-lg ${feature.bgColor} hover:shadow-md transition-all duration-300 hover-lift`}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`${feature.textColor} font-semibold mb-1`}>
                  {feature.title}
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.p className="text-gray-500 mt-4" variants={itemVariants}>
          Use the buttons at the top right to try different user roles.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Home;
