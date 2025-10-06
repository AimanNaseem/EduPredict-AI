import React from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  GraduationCapIcon,
  LightbulbIcon,
  BrainIcon,
} from 'lucide-react'
import '../stylesheet/animations.css'
function Works() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description:
        'Set up your account and invite students to join with a simple code.',
      icon: <BookOpenIcon className="w-6 h-6" />,
    },
    {
      number: 2,
      title: 'Input Data',
      description:
        'Add assignments, quizzes, and track attendance through our intuitive interface.',
      icon: <GraduationCapIcon className="w-6 h-6" />,
    },
    {
      number: 3,
      title: 'Get Predictions',
      description:
        'Our AI analyzes student data to predict performance and identify students needing support.',
      icon: <BrainIcon className="w-6 h-6" />,
    },
    {
      number: 4,
      title: 'Take Action',
      description:
        'Use AI-recommended materials and strategies to improve learning outcomes.',
      icon: <LightbulbIcon className="w-6 h-6" />,
    },
  ]
  // Generate random floating shapes for background animation
  const shapes = Array.from(
    {
      length: 15,
    },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.07 + 0.03,
    }),
  )
  return (
    <div className="w-full py-16 px-4 md:px-8 max-w-9xl mx-auto relative overflow-hidden mb-5">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-full bg-[#9078e2]"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              opacity: shape.opacity,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 0.9, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      {/* Floating shapes */}
     <div className="animated-background">
        {/* Enhanced floating shapes with light purple theme */}
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
        <div className="floating-shape shape5"></div>
        <div className="floating-shape shape6"></div>
        {/* Educational themed icons */}
        <div className="animated-icon book-icon"></div>
        <div className="animated-icon graduation-icon"></div>
        <div className="animated-icon lightbulb-icon"></div>
        {/* Small purple particles */}
        <div className="purple-particle particle-1"></div>
        <div className="purple-particle particle-2"></div>
        <div className="purple-particle particle-3"></div>
        <div className="purple-particle particle-4"></div>
        <div className="purple-particle particle-5"></div>
        <div className="purple-particle particle-6"></div>
        <div className="purple-particle particle-7"></div>
        <div className="purple-particle particle-8"></div>
        {/* Purple glowing areas */}
        <div className="purple-glow glow-1"></div>
        <div className="purple-glow glow-2"></div>
        <div className="purple-glow glow-3"></div>
      </div>
      {/* Educational themed icons */}
      <div className="animated-icon book-icon">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-[15%] left-[10%] text-[#9078e2] opacity-20"
        >
          <BookOpenIcon size={48} />
        </motion.div>
      </div>
      <div className="animated-icon graduation-icon">
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-[70%] left-[85%] text-[#9078e2] opacity-20"
        >
          <GraduationCapIcon size={64} />
        </motion.div>
      </div>
      <div className="animated-icon lightbulb-icon">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-[25%] left-[80%] text-[#9078e2]"
        >
          <LightbulbIcon size={40} />
        </motion.div>
      </div>
      {/* Small purple particles */}
      {Array.from({
        length: 8,
      }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`purple-particle particle-${i + 1} absolute rounded-full bg-[#9078e2]`}
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 80 + 10}%`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      ))}
      {/* Purple glowing areas */}
      <div className="purple-glow glow-1 absolute w-64 h-64 rounded-full bg-[#9078e2]/10 blur-3xl left-[10%] top-[20%]"></div>
      <div className="purple-glow glow-2 absolute w-80 h-80 rounded-full bg-[#9078e2]/5 blur-3xl right-[15%] top-[60%]"></div>
      <div className="purple-glow glow-3 absolute w-48 h-48 rounded-full bg-[#9078e2]/10 blur-3xl left-[50%] top-[30%]"></div>
      {/* Gradient overlay to make text more readable */}
      <div className="absolute inset-0 " />
      <div className="relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            How <span className="text-[#9078e2]">EduPredict</span> Works
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our platform makes it easy to implement predictive analytics in your
            educational environment
          </p>
        </motion.div>
        <div className="relative mt-20">
          {/* Connecting line */}
          <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-200" />
          <div className="flex flex-col md:flex-row justify-between relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                }}
                className="flex flex-col items-center mb-10 md:mb-0 w-full md:w-1/4"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: '#9078e2',
                    borderColor: '#ffffff',
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="group w-20 h-20 rounded-full border-2 border-[#9078e2] flex items-center justify-center bg-white mb-6 relative transition-colors duration-300 cursor-pointer"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0px 0px 0px 0px rgba(144, 120, 226, 0.2)',
                        '0px 0px 0px 10px rgba(144, 120, 226, 0)',
                        '0px 0px 0px 0px rgba(144, 120, 226, 0)',
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: index * 0.5,
                    }}
                    className="w-20 h-20 rounded-full absolute"
                  />
                  <span className="text-[#9078e2] text-3xl font-bold group-hover:text-white transition-colors duration-300">
                    {step.number}
                  </span>
                </motion.div>
                <motion.h3
                  className="text-xl font-semibold mb-2 text-center"
                  whileHover={{
                    color: '#9078e2',
                  }}
                >
                  {step.title}
                </motion.h3>
                <p className="text-gray-600 text-center px-2">
                  {step.description}
                </p>
                <motion.div
                  className="mt-4 text-[#9078e2]"
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  {step.icon}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Works