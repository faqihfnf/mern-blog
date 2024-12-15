import { useSelector } from "react-redux";
import React from "react";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-slate-700 dark:text-slate-200 dark:bg-[rgb(5,10,35)] min-h-screen">{children}</div>
    </div>
  );
}
