import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { FaArrowUp } from "react-icons/fa";
import { TbArrowBigUpLinesFilled } from "react-icons/tb";

const ButtonScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk mengecek posisi scroll
  const checkScrollTop = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      {isVisible && (
        <Button
          gradientDuoTone="purpleToPink"
          onClick={scrollToTop}
          className="w-16 h-16 flex items-center justify-center bg-teal-400 rounded-xl p-2">
          <TbArrowBigUpLinesFilled className="text-4xl" />
        </Button>
      )}
    </div>
  );
};

export default ButtonScrollToTop;
