import React, { useEffect, useState } from "react";
import GradientColor from "./GradientColor";
import { Button } from "flowbite-react";
import Typewriter from "typewriter-effect";

export default function Hero() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/getcategory");
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Extract category names dan kapitalisasi huruf pertama
  const categoryNames = categories.map((category) =>
    capitalizeFirstLetter(category.name)
  );
  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 p-4 sm:p-8 md:p-12 lg:p-16 px-3 max-w-7xl mx-auto">
      <GradientColor />
      <h1 className="bg-gradient-to-l from-teal-600 via-indigo-600 to-pink-600 bg-clip-text font-extrabold text-transparent text-center dark:from-purple-600 dark:via-sky-600 dark:to-green-300 mt-8 sm:mt-12 md:mt-16 text-3xl sm:text-4xl md:text-6xl lg:text-8xl">
        Selamat Datang Para Penuntut Ilmu
      </h1>
      <h2 className="flex justify-center text-center items-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-2 sm:mt-3 md:mt-4 lg:mt-5 italic">
        Bersama Tinta dan Pena hingga Berpisah dengan Dunia yang Fana
      </h2>
      <div className="flex flex-wrap justify-center text-center items-center text-sm sm:text-base md:text-xl lg:text-2xl font-medium mt-2 sm:mt-3 md:mt-4 lg:mt-5">
        <span>Dapatkan artikel-artikel terkait</span>
        <span className="bg-gradient-to-bl flex mx-1 sm:mx-2 text-sm sm:text-base md:text-xl lg:text-2xl from-sky-600 via-purple-600 to-pink-600 bg-clip-text font-extrabold text-transparent dark:from-purple-600 dark:via-sky-600 dark:to-green-300">
          <Typewriter
            options={{
              strings: [...categoryNames],
              autoStart: true,
              loop: true,
              delay: 150,
              deleteSpeed: 150,
              cursor: "",
              wrapperClassName: "typewriter",
            }}
          />
        </span>
        <span>terbaru dari kami</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-10 sm:mb-15 md:mb-20 mt-3 sm:mt-4 md:mt-5">
        <Button
          className="items-center w-36 sm:w-40 md:w-44 min-h-[40px] sm:min-h-[44px]"
          size="lg"
          gradientDuoTone="purpleToBlue"
          onClick={() => (window.location.href = "/search")}>
          Lihat Artikel
        </Button>
        <Button
          className="items-center w-36 sm:w-40 md:w-44 min-h-[40px] sm:min-h-[44px]"
          size="lg"
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => (window.location.href = "/product")}>
          Lihat Product
        </Button>
      </div>
    </div>
  );
}
