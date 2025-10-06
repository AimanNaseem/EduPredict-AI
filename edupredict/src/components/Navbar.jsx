import React from 'react'
import { BookOpenIcon } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
function Navbar() {
  const admin = localStorage.getItem('admin')
  const teacher = localStorage.getItem('teacher')
  const student = localStorage.getItem('student')
  const navigate = useNavigate()
  if (admin) return <Navigate to="/attendance" />
  if (teacher) return <Navigate to="/teacherdashboard" />
  if (student) return <Navigate to="/studentdashboard" />
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between  shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <div className="bg-[#9078e2] p-2 rounded-lg shadow-md">
          <BookOpenIcon size={26} className="text-white" />
        </div>
        <span className="text-xl font-bold ml-2 text-[#9078e2]">EduNex AI</span>
      </div>
      {/* Navigation Items - Centered */}
      <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
        <NavItem text="Home" to="/" />
        <NavItem text="About" to="/about" />
        <NavItem text="Contact" to="/contact" />
      </div>
      {/* Auth Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/login')}
          className="border border-[#9078e2] text-[#9078e2] hover:bg-[#f7f5fe] px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-[#9078e2] hover:bg-[#7b66c8] text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors duration-200"
        >
          Sign up
        </button>
      </div>
    </nav>
  )
}
const NavItem = ({ text, to }) => {
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:text-[#9078e2] hover:bg-[#f7f5fe] font-medium transition-colors duration-200"
    >
      <span>{text}</span>
    </Link>
  )
}
export default Navbar
