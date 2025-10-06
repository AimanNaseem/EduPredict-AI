// components/Dropdown.jsx

import React, { useState } from "react";

const GraphDropdown = ({ setOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-md 
                    border border-gray-300 shadow-sm px-4 py-2 bg-white 
                    text-sm font-medium text-gray-700 hover:bg-gray-50 
                    focus:outline-none"
        >
          Select Month
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 
                    rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5
                    focus:outline-none  z-50"
          role="menu"
        >
          <div className="py-1" role="none">
            <p
              onClick={() => setOption(3)}
              className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-100 cursor-pointer"
            >
              3 months
            </p>
            <p
              onClick={() => setOption(7)}
              className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-100 cursor-pointer"
            >
              7 months
            </p>
            <p
              onClick={() => setOption(10)}
              className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-100 cursor-pointer"
            >
              10 months
            </p>
            <p
              onClick={() => setOption(12)}
              className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-100  cursor-pointer"
            >
              12 months
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphDropdown;
