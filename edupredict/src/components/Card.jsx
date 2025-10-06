import React from 'react'
import PropTypes from 'prop-types'

function Card({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg border-[#9078e2] shadow-sm transition-all duration-300 hover:bg-[#9078e2] hover:transform hover:translate-y-[-5px] hover:text-white group">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-white">{title}</h3>
      <p className="text-gray-600 mb-4 group-hover:text-white/90">
        {description}
      </p>
     
    </div>
  )
}

Card.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string
}

export default Card
