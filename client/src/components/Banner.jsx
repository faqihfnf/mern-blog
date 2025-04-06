import { Button } from "flowbite-react";

export default function Banner({ banner }) {
  return (
    <div className="flex flex-col sm:flex-row p-2 border-teal-600 border-2 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      {/* Gambar Banner */}
      <div className="p-4 sm:p-8 flex justify-center items-center w-full sm:w-[500px]">
        <div className="w-full h-[250px] sm:h-[300px] relative">
          <img
            className="rounded-lg object-cover w-full h-full"
            src={banner.image}
            alt={banner.title}
            loading="lazy"
          />
        </div>
      </div>
      {/* Konten Banner */}
      <div className="flex-1 flex flex-col p-3 h-auto sm:h-[350px]">
        <div className="min-h-[80px] sm:min-h-[100px] flex items-center justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{banner.title}</h2>
        </div>
        <div className="flex-grow min-h-[100px] flex items-center">
          <p className="text-gray-800 dark:text-white text-justify">
            {banner.description}
          </p>
        </div>
        <div className="min-h-[80px] flex items-center justify-center sm:justify-start">
          <Button
            gradientDuoTone="purpleToPink"
            className="rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none w-full p-2"
            onClick={() =>
              window.open(
                banner.link.startsWith("http")
                  ? banner.link
                  : `https://${banner.link}`,
                "_blank"
              )
            }>
            <p className="text-xs md:text-sm">{banner.cta}</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
