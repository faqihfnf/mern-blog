import React, { useState, useEffect } from "react";
import { Pagination } from "flowbite-react";
import ProductCard from "../components/ProductCard";
import GradientColor from "../components/GradientColor";
import SEO from "../components/SEO";
import ButtonScrollToTop from "../components/ButtonScrollToTop";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/product/getproduct?startIndex=${currentPage}&limit=${productsPerPage}`
        );
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
          setTotalProducts(data.totalProducts);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen m-8 p-4 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center ">
      <SEO
        title="Produk Kami | Marifah Store"
        description="Temukan koleksi produk islami berkualitas dari Marifah. Kami menyediakan berbagai produk mulai dari buku, busana muslim, hingga perlengkapan ibadah."
        keywords="produk islami, buku islam, busana muslim, perlengkapan ibadah, marifah store"
        image={
          products[0]?.image || "https://marifah.id/default-product-image.jpg"
        } // Gunakan gambar produk pertama atau default image
      />
      <GradientColor />
      <h1 className="bg-gradient-to-l from-sky-600 via-purple-600 to-pink-600 bg-clip-text py-10 text-5xl font-extrabold text-transparent items-center justify-center flex">
        Produk Kami
      </h1>
      <div className="max-w-2xl mx-auto text-center text-gray-600 dark:text-gray-400"></div>
      <div className="p-2 m-4 items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center mt-8">
            <div className="text-sm text-gray-700 dark:text-gray-400 mb-4">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * productsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * productsPerPage, totalProducts)}
              </span>{" "}
              of <span className="font-semibold">{totalProducts}</span> products
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showIcons={true}
            />
          </div>
        )}
      </div>
      <ButtonScrollToTop />
    </div>
  );
}
