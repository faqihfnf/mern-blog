import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3  border-teal-600 border-2 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Ingin lancar membaca Al-Quran?</h2>
        <p className="text-gray-800 my-2">
          Mari belajar membaca Al-Quran bersama kami
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none min-h-[44px] px-6 py-3"
          onClick={() => window.open("#", "_blank")}>
          Mahir membaca Al-Quran
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          className="rounded-lg"
          src="/quran.jpg"
          alt="belajar alquran"
          loading="lazy"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}
