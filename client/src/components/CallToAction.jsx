import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3  border-teal-600 border-2 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Ingin lancar membaca Al-Quran?</h2>
        <p className="text-gray-500 my-2">Mari belajar membaca Al-Quran bersama kami</p>
        <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none">
          <a href="#" target="_blank" rel="noopener noreferrer">
            Mahir membaca Al-Quran
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img className="rounded-lg" src="https://cdn.pixabay.com/photo/2021/12/11/09/19/quran-6862296_1280.jpg" />
      </div>
    </div>
  );
}
