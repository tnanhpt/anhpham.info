import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import React from "react";

const DarkModeSw = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={toggleDarkMode}
        className="relative w-20 h-8 bg-teal-500 dark:bg-gray-600 rounded-full shadow-inner transition-colors duration-300 flex items-center justify-between px-1"
      >
        <MoonIcon
          className={`w-5 h-5 text-gray-700 transition-opacity duration-300 ${
            isDarkMode ? "opacity-100" : "opacity-0"
          }`}
        />
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isDarkMode ? "translate-x-12" : "translate-x-0"
          }`}
        ></span>

        <SunIcon
          className={`w-6 h-6 text-yellow-400 transition-opacity duration-300 ${
            isDarkMode ? "opacity-0" : "opacity-100"
          }`}
        />
      </button>
    </div>
  );
};

export default DarkModeSw;
