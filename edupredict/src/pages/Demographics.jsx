import React from 'react';
import { motion } from 'framer-motion';
const Demographics = () => {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  return <motion.div className="p-4" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold mb-2">Demographics</h1>
        <p className="mb-6 text-gray-600">
          This is the demographics analysis page for administrators.
        </p>
      </motion.div>
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" variants={containerVariants}>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" variants={itemVariants} whileHover={{
        y: -5,
        transition: {
          duration: 0.2
        }
      }}>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Age Distribution
          </h2>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
            <motion.div className="w-full h-full px-4 py-2 flex items-end justify-around" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.3,
            duration: 0.5
          }}>
              {[65, 85, 45, 90, 55, 30].map((height, i) => <motion.div key={i} className="relative h-full flex flex-col items-center justify-end" initial={{
              height: 0
            }} animate={{
              height: `${height}%`
            }} transition={{
              duration: 0.8,
              delay: i * 0.1,
              ease: 'easeOut'
            }}>
                  <div className="w-10 bg-blue-500 rounded-t-lg relative group">
                    <motion.div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200" initial={{
                  opacity: 0,
                  y: 10
                }} whileHover={{
                  opacity: 1,
                  y: 0
                }}>
                      {height}%
                    </motion.div>
                    <motion.div className="h-full" initial={{
                  height: 0
                }} animate={{
                  height: '100%'
                }} transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}></motion.div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {i + 13}-{i + 14}
                  </div>
                </motion.div>)}
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" variants={itemVariants} whileHover={{
        y: -5,
        transition: {
          duration: 0.2
        }
      }}>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            Gender Distribution
          </h2>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
            <motion.div className="w-48 h-48 relative" initial={{
            rotate: -90,
            opacity: 0
          }} animate={{
            rotate: 0,
            opacity: 1
          }} transition={{
            duration: 1,
            delay: 0.3,
            ease: 'easeOut'
          }}>
              <svg viewBox="0 0 100 100">
                <motion.circle cx="50" cy="50" r="40" fill="transparent" stroke="#c7d2fe" strokeWidth="20" />
                <motion.circle cx="50" cy="50" r="40" fill="transparent" stroke="#4f46e5" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="100.48" initial={{
                strokeDashoffset: 251.2
              }} animate={{
                strokeDashoffset: 100.48
              }} transition={{
                duration: 1,
                delay: 0.5
              }} />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-lg font-bold">
                  60%
                </text>
              </svg>
              <div className="absolute bottom-0 w-full flex justify-around text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
                  <span>Male</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-200 rounded-full mr-1"></div>
                  <span>Female</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" variants={itemVariants} whileHover={{
        y: -5,
        transition: {
          duration: 0.2
        }
      }}>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
            Geographic Distribution
          </h2>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 relative overflow-hidden">
            <motion.div className="absolute inset-0 flex items-center justify-center" initial={{
            scale: 0.8,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }}>
              <div className="relative">
                <svg width="240" height="150" viewBox="0 0 240 150" className="opacity-60">
                  <path d="M0,0 L240,0 L240,150 L0,150 Z" fill="#e5e7eb" />
                  <path d="M40,50 L60,30 L100,40 L140,20 L180,40 L200,30 L240,50 L240,150 L0,150 L0,70 L40,50 Z" fill="#d1fae5" />
                  <path d="M40,50 L60,30 L100,40 L140,20 L180,40 L200,30 L240,50" fill="none" stroke="#059669" strokeWidth="1" />
                </svg>
                <motion.div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-500 rounded-full" initial={{
                scale: 0
              }} animate={{
                scale: [0, 1.5, 1]
              }} transition={{
                duration: 1,
                delay: 0.8
              }} />
                <motion.div className="absolute top-1/3 right-1/3 w-3 h-3 bg-emerald-500 rounded-full" initial={{
                scale: 0
              }} animate={{
                scale: [0, 1.5, 1]
              }} transition={{
                duration: 1,
                delay: 1.0
              }} />
                <motion.div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-emerald-500 rounded-full" initial={{
                scale: 0
              }} animate={{
                scale: [0, 1.5, 1]
              }} transition={{
                duration: 1,
                delay: 1.2
              }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Socioeconomic Status
          </h2>
          <div className="space-y-4">
            {['Low Income', 'Middle Income', 'High Income'].map((category, i) => <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span>{[45, 30, 25][i]}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div className={`h-2 rounded-full ${i === 0 ? 'bg-purple-500' : i === 1 ? 'bg-purple-400' : 'bg-purple-300'}`} initial={{
                width: 0
              }} animate={{
                width: `${[45, 30, 25][i]}%`
              }} transition={{
                duration: 0.8,
                delay: i * 0.2,
                ease: 'easeOut'
              }}></motion.div>
                  </div>
                </div>)}
          </div>
          <div className="mt-4 pt-4 border-t">
            <button className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200">
              View Detailed Report →
            </button>
          </div>
        </motion.div>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            Ethnicity Distribution
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[{
            name: 'Caucasian',
            value: '35%'
          }, {
            name: 'African American',
            value: '25%'
          }, {
            name: 'Hispanic',
            value: '20%'
          }, {
            name: 'Asian',
            value: '15%'
          }, {
            name: 'Other',
            value: '5%'
          }].map((item, i) => <motion.div key={i} className="p-3 rounded-lg bg-amber-50 border border-amber-100" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.3,
            delay: i * 0.1
          }} whileHover={{
            scale: 1.05,
            transition: {
              duration: 0.2
            }
          }}>
                <div className="text-sm font-medium text-amber-800">
                  {item.name}
                </div>
                <div className="text-lg font-bold text-amber-600">
                  {item.value}
                </div>
              </motion.div>)}
          </div>
          <div className="mt-4 pt-4 border-t">
            <button className="text-sm text-amber-600 hover:text-amber-800 transition-colors duration-200">
              View Detailed Report →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>;
};
export default Demographics;