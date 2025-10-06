import React, { useEffect, useRef } from 'react'
import {
  GraduationCapIcon,
  BarChartIcon,
  UsersIcon,
  BrainIcon,
  TrendingUpIcon,
} from 'lucide-react'
import ContactSection from '../components/ContactSection'
import StarBackground from '../components/StarBackground'
import '../stylesheet/animations.css'
export function About() {
    const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)
  useEffect(() => {
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
    // Observe all animated elements
    if (headingRef.current) observer.observe(headingRef.current)
    if (card1Ref.current) observer.observe(card1Ref.current)
    if (card2Ref.current) observer.observe(card2Ref.current)
    if (card3Ref.current) observer.observe(card3Ref.current)
    // Cleanup
    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current)
      if (card1Ref.current) observer.unobserve(card1Ref.current)
      if (card2Ref.current) observer.unobserve(card2Ref.current)
      if (card3Ref.current) observer.unobserve(card3Ref.current)
    }
  }, [])
  // Simple animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])
  return (
    <div className="w-full">
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
     <ContactSection />
      <StarBackground />
    <section
      className="py-16 md:py-24 container mx-auto px-6"
      ref={sectionRef}
    >
      <div
        ref={headingRef}
        className="max-w-3xl mx-auto text-center mb-16 opacity-0 transition-all duration-1000"
      >
        <h2 className="text-4xl md:text-4xl font-bold mb-4">
            Our Approach to <span className="text-[#9078e2]">Education</span> Prediction
          </h2>
        <p className="text-lg text-gray-600">
          We combine advanced data analytics, machine learning, and educational
          expertise to provide accurate predictions about student performance
          and educational outcomes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          ref={card1Ref}
          className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all opacity-0 duration-500 transform hover:translate-y-[-5px] hover:bg-purple-50 group"
          style={{
            transitionDelay: '0.1s',
          }}
        >
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-purple-200 group-hover:scale-110">
            <BrainIcon className="h-8 w-8 text-[#9078e2] transition-all duration-300 group-hover:text-purple-700 group-hover:rotate-12" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 transition-all duration-300 group-hover:text-purple-700 group-hover:translate-x-1">
            AI-Powered Analysis
          </h3>
          <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-700">
            Our algorithms analyze multiple data points to identify patterns and
            predict educational outcomes with high accuracy.
          </p>
        </div>
        <div
          ref={card2Ref}
          className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all opacity-0 duration-500 transform hover:translate-y-[-5px] hover:bg-purple-50 group"
          style={{
            transitionDelay: '0.2s',
          }}
        >
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-purple-200 group-hover:scale-110">
            <BarChartIcon className="h-8 w-8 text-[#9078e2] transition-all duration-300 group-hover:text-purple-700 group-hover:rotate-12" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 transition-all duration-300 group-hover:text-purple-700 group-hover:translate-x-1">
            Data-Driven Insights
          </h3>
          <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-700">
            Transform raw educational data into actionable insights that help
            educators make informed decisions.
          </p>
        </div>
        <div
          ref={card3Ref}
          className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all opacity-0 duration-500 transform hover:translate-y-[-5px] hover:bg-purple-50 group"
          style={{
            transitionDelay: '0.3s',
          }}
        >
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-purple-200 group-hover:scale-110">
            <GraduationCapIcon className="h-8 w-8 text-[#9078e2] transition-all duration-300 group-hover:text-purple-700 group-hover:rotate-12" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 transition-all duration-300 group-hover:text-purple-700 group-hover:translate-x-1">
            Personalized Learning
          </h3>
          <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-700">
            Customize educational experiences based on individual student needs,
            strengths, and learning styles.
          </p>
        </div>
      </div>
    </section>
      {/* Statistics Section */}
      <section className="bg-[#9078e2] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center animate-on-scroll opacity-0">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                98%
              </div>
              <p className="text-white">Prediction Accuracy</p>
            </div>
            <div
              className="text-center animate-on-scroll opacity-0"
              style={{
                transitionDelay: '0.1s',
              }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                1.2M+
              </div>
              <p className="text-white">Students Analyzed</p>
            </div>
            <div
              className="text-center animate-on-scroll opacity-0"
              style={{
                transitionDelay: '0.2s',
              }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                500+
              </div>
              <p className="text-white">Educational Institutions</p>
            </div>
            <div
              className="text-center animate-on-scroll opacity-0"
              style={{
                transitionDelay: '0.3s',
              }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                25%
              </div>
              <p className="text-white">Performance Improvement</p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Methodology */}
      <section className="py-16 md:py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Our Prediction Methodology
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We use a comprehensive approach that combines historical data,
              real-time assessments, and contextual factors to deliver accurate
              educational predictions.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-green-500 rounded-full p-1 mt-1 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Analyze historical performance data across multiple dimensions
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-500 rounded-full p-1 mt-1 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Incorporate real-time assessment results and engagement
                  metrics
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-500 rounded-full p-1 mt-1 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Consider environmental and socioeconomic factors
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-500 rounded-full p-1 mt-1 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Apply machine learning models trained on diverse educational
                  datasets
                </span>
              </li>
            </ul>
          </div>
          <div className="relative animate-on-scroll opacity-0">
            <div className="absolute -top-6 -right-6 bg-indigo-500 w-32 h-32 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 bg-purple-500 w-24 h-24 rounded-full opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80"
              alt="Education analytics dashboard"
              className="rounded-lg shadow-xl relative z-10 transform transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>
      {/* Team Section */}
    
      
    </div>
  )
}