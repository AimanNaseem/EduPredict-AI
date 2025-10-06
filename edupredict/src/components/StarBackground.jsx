import React from 'react'

function StarBackground() {
   return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Small stars (existing) */}
      {Array.from({
        length: 20,
      }).map((_, i) => (
        <div
          key={`small-${i}`}
          className="absolute rounded-full bg-[#FCC6FF] opacity-70 animate-twinkle"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            filter: 'blur(1px)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
          }}
        />
      ))}
      {/* New larger blurry stars */}
      {Array.from({
        length: 10,
      }).map((_, i) => (
        <div
          key={`large-${i}`}
          className="absolute rounded-full bg-[#FCC6FF] opacity-50 animate-twinkle"
          style={{
            width: `${Math.random() * 15 + 10}px`,
            height: `${Math.random() * 15 + 10}px`,
            filter: 'blur(4px)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 7}s`,
            animationDuration: `${Math.random() * 8 + 7}s`,
          }}
        />
      ))}
    </div>
  )
}

export default StarBackground