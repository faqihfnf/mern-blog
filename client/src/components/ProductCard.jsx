import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // Fungsi untuk memformat harga
  const formatPrice = (price) => {
    return price.toLocaleString("id-ID", {
      // style: "currency",
      // currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <Card className="max-w-sm h-full flex flex-col group bg-purple-200/10 rounded-xl border shadow-indigo-500/20  shadow-xl transition hover:border-teal-500 hover:shadow-teal-500/20 dark:hover:border-pink-500 dark:hover:shadow-pink-500/20">
      <a href={product.link.startsWith("http") ? product.link : `https://${product.link}`} target="_blank" rel="noopener noreferrer" className="flex-1">
        <div className="relative h-64 overflow-hidden rounded-md">
          <img className="absolute w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125" src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className="mt-2 flex h-20 flex-col">
          <div className="flex">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-3 line-clamp-2">{product.name}</h5>
          </div>
        </div>
        <div className="flex">
          <div className="flex">
            <span className="text-lg text-gray-900 dark:text-white">{product.price === 0 ? "Gratis" : formatPrice(product.price)}</span>
          </div>
        </div>
      </a>
    </Card>
  );
};

export default ProductCard;
