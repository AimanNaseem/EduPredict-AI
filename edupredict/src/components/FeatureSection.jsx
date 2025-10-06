import React from 'react'

import { BarChartIcon, BookOpenIcon, LightbulbIcon } from 'lucide-react'
import Card from './Card'

function FeatureSection() {
 return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-[#9078e2] text-white font-medium">
            Popular Subject
          </div>
          <h2 className="text-4xl font-bold text-black">
           Empowering Education with 
            <br />
           AI & Predictive Insights
          </h2>
          <p className="text-gray-600">
           At EduNex AI, we harness the power of AI to transform learning into a smarter, 
           data-driven experience. Our platform empowers educators with performance prediction tools that identify learning gaps before they become challenges. With detailed analytics and actionable insights,
            teachers and institutions can make informed decisions that drive student success.
          </p>
          <div className="flex">
            <div className="w-1 bg-[#9078e2] mr-4"></div>
            <p className="text-gray-600">
             To ensure a seamless learning journey, EduPredict also provides 24/7 AI chatbot support, 
             guiding students whenever they need assistance. Role-based access keeps the platform secure and personalized for educators, students,
            and administrators—offering each the right tools and dashboards to achieve their goals with confidence.
            </p>
          </div>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            icon={<BarChartIcon className="w-8 h-8 text-[#9078e2]" />}
            title="Performance Prediction"
            description="Leverage AI algorithms to predict student performance and identify learning gaps before they become problems."
          />
          <Card
            icon={<LightbulbIcon className="w-8 h-8 text-[#9078e2]" />}
            title="AI Chatbot Assistant"
            description="24/7 support for students with our intelligent chatbot that answers questions and provides guidance."
          />
          <Card
            icon={<BookOpenIcon className="w-8 h-8 text-[#9078e2]" />}
            title="Comprehensive Analytics"
            description="Detailed insights into class and individual performance with actionable recommendations."
          />
          <Card
            icon={<BarChartIcon className="w-8 h-8 text-[#9078e2]" />}
            title="Role-Based Access"
            description="Secure access for educators, students, and administrators with role-specific features and dashboards."
          />
        </div>
      </div>
    </div>
  )
}

export default FeatureSection