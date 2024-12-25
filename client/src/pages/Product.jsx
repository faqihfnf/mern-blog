import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

export default function Product() {
  return (
    <div className="min-h-screen m-8 p-4">
      <h1 className="text-5xl font-bold mb-8 items-center justify-center flex">Produk Kami</h1>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card className="w-full items-center flex justify-center group" imgAlt="">
            <Link to={"https://clicky.id/marifa/amal-terus-mengalir-pahalanya"} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center overflow-hidden">
                <img className="w-full h-64 transition-transform duration-300 ease-in-out group-hover:scale-125" src="/test.png" alt="" />
              </div>
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport</h5>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
