import React from "react";

export default function GradientColor() {
  return (
    <div className="">
      {/* Purple gradient */}
      <div className="absolute mt-28 lg:mt-0 -z-100 top-20 left-0 w-full blur-[125px] h-1/3 bg-gradient-to-br from-violet-500 via-transparent to-pink-400 dark:bg-gradient-to-br dark:from-cyan-500 dark:via-transparent dark:to-green-400 "></div>
      {/* Blue gradient */}
      <div className="absolute mt-28 lg:mt-16 -z-100 top-0 right-0 w-[40%] blur-[150px] h-1/6 bg-gradient-to-bl from-cyan-500 via-sky-300 to-green-500"></div>
    </div>
  );
}
