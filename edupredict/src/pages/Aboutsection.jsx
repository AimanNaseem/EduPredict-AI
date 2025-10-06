import React from 'react'

function Aboutsection() {
 return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 relative overflow-hidden">
        {/* Dotted pattern decoration */}
        <div className="absolute top-4 left-4 w-40 h-40 grid grid-cols-10 gap-2">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-indigo-600"></div>
          ))}
        </div>
        {/* Purple semi-circle */}
        <div className="absolute left-0 top-64 w-32 h-32 bg-indigo-600 rounded-full opacity-90 -ml-16"></div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 relative z-10 mt-12">
          {/* Left side with images */}
          <div className="md:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="Students in classroom"
              className="w-full rounded-lg"
            />
            {/* Experience badge */}
            <div className="absolute bottom-16 left-0 bg-white py-4 px-6 rounded-r-lg shadow-md">
              <div className="flex items-center">
                <span className="text-indigo-600 text-4xl font-bold">
                  13<span className="text-2xl">+</span>
                </span>
                <div className="ml-4">
                  <p className="font-bold text-sm">YEARS EXPERIENCE</p>
                  <p className="font-bold text-sm">JUST ACHIVED</p>
                </div>
              </div>
            </div>
            {/* Second image */}
            <div className="absolute -bottom-4 right-4 w-48 h-48 rounded-lg overflow-hidden border-4 border-white shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Right side with text */}
          <div className="md:w-1/2 pt-16 md:pt-8">
            <div className="inline-block bg-[#9078e2] px-6 py-2  rounded-full text-white font-medium">
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Welcome to the{' '}
              <span className="relative">
                Online
                <span className="absolute bottom-1 left-0 w-full h-1 bg-pink-500"></span>
              </span>{' '}
              Learning Center
            </h1>
            <div className="border-l-2 border-gray-300 pl-4 py-2 mb-6">
              <p className="text-gray-600">
                25+ Contrary to popular belief, Lorem Ipsum is not simply random
                text roots in a piece of classical Latin literature from 45 BC
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  Lorem Ipsum is simply dummy
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  Explore a variety of fresh educational teach
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg
                    className="w-3 h-3 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  Lorem Ipsum is simply dummy text of
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Aboutsection