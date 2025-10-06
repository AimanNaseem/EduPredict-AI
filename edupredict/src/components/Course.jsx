import React from 'react'
import { BookOpenIcon } from 'lucide-react'
const Course = ({ title, courseCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-shadow hover:border-[#9078e2] border border-transparent cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-[#9078e2] transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{courseCount} courses</p>
        </div>
        <div className="bg-[#9078e2]/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-[#9078e2] transition-colors">
          <BookOpenIcon
            size={18}
            className="text-[#9078e2] group-hover:text-white transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
export default Course