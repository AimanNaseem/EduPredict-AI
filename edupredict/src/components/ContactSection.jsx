import React, { useEffect, useState } from 'react'
const ContactSection = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
      setIsLoaded(true)
    }, [])
  const [setAnimationPosition] = useState({
    x: 50,
    y: 50,
  })
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPosition({
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  return (
<div className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#121631]">
      {/* Animated element */}
      <div className="hidden md:block">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2228/2228104.png"
          alt=""
          className="absolute top-10 left-10 w-12 h-12 opacity-20 animate-bounce"
          style={{ animationDuration: '4s' }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048966.png"
          alt=""
          className="absolute top-32 right-20 w-10 h-10 opacity-20 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/3655/3655586.png"
          alt=""
          className="absolute bottom-20 left-24 w-14 h-14 opacity-20 animate-bounce"
          style={{ animationDuration: '6s' }}
        />
        <img
            src="https://cdn-icons-png.flaticon.com/512/2972/2972531.png"
            alt="Book"
            className="absolute top-1/2 -left-10 w-14 h-14 z-20 animate-float-diagonal"
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


      {/* ✅ Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-[#9078e2]">EduNex AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            At EduPredict, we’re dedicated to transforming education with AI-powered insights.
            Whether you want to learn more about our mission or reach out for support, we’re here
            to guide educators, students, and institutions toward smarter learning outcomes.
          </p>
        </div>
      </div>

      <div
        className={`w-full md:w-1/2 mt-10 md:mt-0 ${isLoaded ? 'animate-fade-in-delayed' : 'opacity-0'}`}
      >
        
      </div>
    </div>
    </div>
  )
}
export default ContactSection
