import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#f1eff9] dark:from-gray-900 dark:to-gray-800">
    <div className="relative">
      <img
        src="assets/loader.gif"
        alt="Loading..."
        className="w-72 h-72" // Change 32 to any other size if needed
      />
    </div>
  </div>
  
  );
};
export default Loader;
