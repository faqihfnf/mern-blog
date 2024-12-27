import React, { useState, useEffect } from "react";
import { Pagination } from "flowbite-react";
import ProductCard from "../components/ProductCard";

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
    <div className="min-h-screen m-4 p-4">
      <h1 className="text-5xl font-bold mb-8 text-center">Produk Kami</h1>
      <div className="container flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
