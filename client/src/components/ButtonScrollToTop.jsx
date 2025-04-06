import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { TbArrowBigUpLinesFilled } from "react-icons/tb";
import { TbArrowBadgeUpFilled } from "react-icons/tb";

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
    <div className="fixed bottom-2 right-2">
      {isVisible && (
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={scrollToTop}
          className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl p-2">
          <TbArrowBadgeUpFilled className="text-5xl lg:text-6xl" />
        </Button>
      )}
    </div>
  );
};

export default ButtonScrollToTop;
