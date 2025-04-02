import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={handleThemeToggle}
      className="relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner flex items-center cursor-pointer">
      <div
        className={`
          absolute w-6 h-6   bg-white rounded-full shadow-md transform transition-transform duration-500 ease-in-out
          ${theme === "dark" ? "translate-x-9" : "translate-x-1"}
        `}>
        {theme === "dark" ? (
          <FaMoon className="w-full h-full p-1 text-blue-800" />
        ) : (
          <FaSun className="w-full h-full p-1 text-yellow-300" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
