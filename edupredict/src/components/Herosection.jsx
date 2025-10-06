import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Herosection() {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  return (
    <div className="w-full bg-gradient-to-br from-[#1a1a35] to-[#252550] py-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Educational floating elements */}
      <div className="hidden md:block">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2228/2228104.png"
          alt=""
          className="absolute top-10 left-10 w-12 h-12 opacity-20 animate-bounce"
          style={{
            animationDuration: '4s',
          }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048966.png"
          alt=""
          className="absolute top-32 right-20 w-10 h-10 opacity-20 animate-pulse"
          style={{
            animationDuration: '4s',
          }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/3655/3655586.png"
          alt=""
          className="absolute bottom-20 left-24 w-14 h-14 opacity-20 animate-bounce"
          style={{
            animationDuration: '6s',
          }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/2228/2228104.png"
          alt=""
          className="absolute bottom-32 right-32 w-12 h-12 opacity-20 animate-pulse"
          style={{
            animationDuration: '7s',
          }}
        />
      </div>
      {/* Animated particles */}
      <div className="particle-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${i + 1} ${isLoaded ? 'animate-particle' : ''}`}
            style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${8 + i * 2}s`,
            }}
          ></div>
        ))}
      </div>
      {/* Decorative elements */}
      <div className="absolute top-8 left-24 w-6 h-6 border border-[#9078e2] rotate-45 opacity-20"></div>
      <div className="absolute bottom-16 right-24 w-6 h-6 border border-orange-400 rotate-45 opacity-20"></div>
      {/* Animated shapes */}
      <div className="absolute left-1/4 top-1/4 w-20 h-20 animate-spin-slow opacity-10">
        <div className="absolute inset-0 border-2 border-[#9078e2] rounded-full"></div>
        <div className="absolute inset-2 border-2 border-orange-400 rotate-45"></div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 z-10">
          <p
            className={`text-[#9078e2] uppercase tracking-wider text-sm font-medium mb-2 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}
          >
            EDUCATION SOLUTION
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            <span
              className={`inline-block ${isLoaded ? 'animate-typing-effect' : ''}`}
            >
              Smarter Predictions.
            </span>
            <br />
            <span
              className={`inline-block ${isLoaded ? 'animate-typing-effect-delayed' : ''}`}
            >
              Stronger Student Success.
            </span>
          </h1>
          <p
            className={`text-gray-300 mb-8 max-w-lg ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
          >
            EduPredict leverages predictive analytics and smart classroom
            management to help educators spot at-risk students early and deliver
            personalized learning experiences powered by AI.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
          >
            <button className="bg-[#9078e2] hover:bg-[#7b66c8] text-white font-medium py-2.5 px-6 rounded animate-pulse-glow relative overflow-hidden group">
              <span className="relative z-10">View Courses</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-white font-medium py-2.5 px-6 flex items-center border border-[#9078e2] hover:bg-[#9078e2]/10 group"
            >
              <span>Login</span>
              <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
          </div>
        </div>
        <div
          className={`w-full md:w-1/2 mt-10 md:mt-0 relative ${isLoaded ? 'animate-fade-in-delayed' : 'opacity-0'}`}
        >
          <div className="relative z-10 animate-floating-image">
            <div className="absolute -top-20 -right-10 w-64 h-64 bg-[#9078e2] rounded-full filter blur-xl opacity-50 animate-pulse-slow"></div>
            <div className="absolute top-20 -right-20 w-80 h-80 bg-pink-500 rounded-full filter blur-xl opacity-30 animate-pulse-slow-2"></div>
            <div className="absolute -bottom-10 left-20 w-40 h-40 bg-yellow-500 rounded-full filter blur-xl opacity-30 animate-pulse-slow-3"></div>
            {/* Main educational image */}
            <img
              src="https://foxpixel.vercel.app/edurock/edurock/img/about/about_1.png"
              alt="Student studying with laptop"
              className="relative z-10 max-w-full h-auto rounded-lg shadow-xl"
            />
            {/* Floating educational icons around the main image */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/2436/2436874.png"
              alt="Math symbol"
              className="absolute -top-5 -left-5 w-16 h-16 z-20 animate-pulse"
              style={{
                animationDuration: '4s',
              }}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/1157/1157109.png"
              alt="Science beaker"
              className="absolute top-1/4 -right-5 w-14 h-14 z-20 animate-bounce"
              style={{
                animationDuration: '5s',
              }}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/3655/3655544.png"
              alt="Graduation cap"
              className="absolute -bottom-5 right-1/4 w-16 h-16 z-20 animate-pulse"
              style={{
                animationDuration: '6s',
              }}
            />
            {/* Additional animated educational elements */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/2972/2972531.png"
              alt="Book"
              className="absolute top-1/2 -left-10 w-14 h-14 z-20 animate-float-diagonal"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/2228/2228104.png"
              alt="Lightbulb"
              className="absolute -top-10 right-1/3 w-12 h-12 z-20 animate-pulse-and-rotate"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Herosection