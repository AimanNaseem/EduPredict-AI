import React from 'react'
import Herosection from '../components/Herosection'
import Aboutsection from '../components/Aboutsection'
import StarBackground from '../components/StarBackground'
import FeatureSection from '../components/FeatureSection'
import Works from '../components/Works'
import Course from '../components/Course'
import '../stylesheet/animations.css'
const categories = [
  {
    title: 'Digital Marketing',
    courseCount: 10,
  },
  {
    title: 'Generative AI',
    courseCount: 15,
  },
  {
    title: 'Cyber Security',
    courseCount: 12,
  },
  {
    title: 'Graphics Desiging',
    courseCount: 8,
  },
  {
    title: 'Web Development',
    courseCount: 9,
  },
  {
    title: 'Data Science',
    courseCount: 10,
  },
  {
    title: 'ML/DL',
    courseCount: 21,
  },
  {
    title: 'MERN Stack',
    courseCount: 10,
  },
  {
    title: 'DevOps',
    courseCount: 16,
  },
  {
    title: 'Business Analytics',
    courseCount: 10,
  },
  {
    title: 'App Developments',
    courseCount: 12,
  },
  {
    title: 'Cyber Security',
    courseCount: 10,
  },
]
function Home1() {
  return (
    <div className="w-full min-h-screen">
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
      <Herosection />
      <Aboutsection />
      <StarBackground />
      <FeatureSection />
      <Works />
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 ">
          {/* bg-gradient-to-br from-white via-purple-50 to-[#9078e2]/10 z-0 */}
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
          <div className="bubble bubble-4"></div>
          <div className="bubble bubble-5"></div>
        </div>
        {/* Content */}
        <div className="relative z-10 py-10 px-4 md:px-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-5 animate-fadeIn">
              Explore Our <span className="text-[#9078e2]">Course</span>{' '}
              Categories
            </h1>
            <p className="text-gray-600 max-w-3xl text-center mb-10 mx-auto">
              Smart course categories designed to guide every student's journey.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="h-24 animate-fadeIn"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                  }}
                >
                  <Course
                    title={category.title}
                    courseCount={category.courseCount}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home1
