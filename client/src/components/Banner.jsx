import { Button } from "flowbite-react";

export default function Banner({ banner }) {
  return (
    <div className="flex flex-col sm:flex-row p-2 border-teal-600 border-2 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-4xl font-bold m-5">{banner.title}</h2>
        <p className="text-gray-800 dark:text-white my-2 text-justify">
          {banner.description}
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="mt-5 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none min-h-[44px] px-6 py-3"
          onClick={() =>
            window.open(
              banner.link.startsWith("http")
                ? banner.link
                : `https://${banner.link}`,
              "_blank"
            )
          }>
          {banner.cta}
        </Button>
      </div>
      <div className="p-8 flex w-[500px] h-[350px]">
        <img
          className="rounded-lg"
          src={banner.image}
          alt={banner.title}
          loading="lazy"
          width={400}
          height={250}
        />
      </div>
    </div>
  );
}
