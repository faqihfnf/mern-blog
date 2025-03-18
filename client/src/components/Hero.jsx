import React from "react";
import GradientColor from "./GradientColor";
import { Button } from "flowbite-react";

export default function Hero() {
  return (
    <div className="flex flex-col gap-6 p-16 px-3 max-w-6xl mx-auto">
      <GradientColor />
      <h1 className="bg-gradient-to-l from-teal-600 via-indigo-600 to-pink-600 bg-clip-text font-extrabold text-transparent  text-center dark:from-purple-600 dark:via-sky-600 dark:to-green-300 mt-16 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
        Selamat Datang Para Penuntut Ilmu
      </h1>
      <p className="flex justify-center text-center items-center text-2xl font-semibold mt-5">
        Bersama Tinta dan Pena hingga Berpisah dengan Dunia yang Fana
      </p>
      <div className="flex flex-row sm:flex-row gap-4 items-center justify-center mb-20 mt-5">
        <Button
          className="items-center w-44 min-h-[44px]"
          size="xl"
          gradientDuoTone="purpleToPink"
          onClick={() => (window.location.href = "/search")}>
          Lihat Artikel
        </Button>
        <Button
          className="items-center w-44 min-h-[44px]"
          size="xl"
          outline
          gradientDuoTone="redToYellow"
          onClick={() => (window.location.href = "/product")}>
          Lihat Product
        </Button>
      </div>
    </div>
  );
}
