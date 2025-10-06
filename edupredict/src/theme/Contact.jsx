import React, { useState } from 'react'
import ContactSection from '../components/ContactSection'
import StarBackground from '../components/StarBackground'
import '../stylesheet/animations.css'

function Contact() {
      const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic would go here
    alert('Form submitted!')
    setFormData({
      name: '',
      email: '',
      message: '',
    })
  }
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
      <ContactSection />
       <StarBackground />
    <div className="w-full py-16 px-6 ">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-[#9078e2] mx-auto"></div>
          <p className="text-gray-600 mt-4">
            We'd love to hear from you. Fill out the form below.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-lg p-8 shadow-lg"
        >
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9078e2]"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9078e2]"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9078e2]"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#9078e2] hover:bg-purple-600 text-white font-medium rounded-md transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Contact