import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Pagination, Modal, Button, Toast } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaPlus } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

export default function DashboardProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/product/getproduct?startIndex=${currentPage}&limit=${productsPerPage}`);
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

    if (currentUser?.isAdmin) {
      fetchProducts();
    }
  }, [currentUser?._id, currentPage]);

  const onPageChange = (startIndex) => {
    setCurrentPage(startIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Menghitung showing page info
  const startIndex = (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(startIndex + productsPerPage - 1, totalProducts);

  const handleDeleteProduct = async () => {
    setShowModal(false);
    setShowToast(false);
    try {
      const res = await fetch(`/api/product/deleteproduct/${productIdToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        // Refresh data setelah menghapus
        const refreshRes = await fetch(`/api/product/getproduct?page=${currentPage}&limit=${productsPerPage}`);
        const refreshData = await refreshRes.json();
        setProducts(refreshData.products);
        setTotalPages(refreshData.totalPages);
        setTotalProducts(refreshData.totalProducts);

        // Jika halaman saat ini kosong, kembali ke halaman sebelumnya
        if (refreshData.products.length === 0 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex w-full p-8 min-h-screen">
      <div className="flex-1 lg:w-3/4 table-auto overflow-x-scroll mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <div className="mb-4 w-52">
          <Link to={"/create-product"}>
            <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
              <FaPlus size={20} className="mr-2 mt-1" />
              <span className="font-poppins text-lg">Create Product</span>
            </Button>
          </Link>
        </div>
        {currentUser?.isAdmin && products.length > 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Table hoverable={true} className="shadow-lg">
                <Table.Head className="">
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Product Photo</Table.HeadCell>
                  <Table.HeadCell>Product Name</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Link</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {products.map((product) => (
                    <Table.Row key={product._id} className="bg-white dark:border-slate-700 dark:bg-slate-800">
                      <Table.Cell>{new Date(product.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover bg-gray-400" />
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-slate-900 dark:text-white">{product.name}</span>
                      </Table.Cell>
                      <Table.Cell>
                        {product.price.toLocaleString("id-ID", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Product
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-600 font-semibold hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setProductIdToDelete(product._id);
                          }}
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-product/${product._id}`}>
                          <span className="text-teal-600 font-semibold hover:underline cursor-pointer">Edit</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="mt-auto pt-5">
              <div className="text-sm text-center text-slate-800 dark:text-slate-200">
                Showing {startIndex} to {endIndex} of {totalProducts} entries
              </div>
              <div className="flex overflow-x-auto sm:justify-center mt-2">
                <Pagination currentPage={currentPage} totalPages={Math.max(1, totalPages)} onPageChange={onPageChange} showIcons={true} />
              </div>
            </div>
          </div>
        ) : (
          <p>Tidak ada produk untuk saat ini</p>
        )}
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <FaExclamationCircle className="text-6xl text-gray-500 mb-4 mx-auto" />
              <h3 className="mb-5 text-xl font-normal text-gray-500">Apakah anda yakin ingin menghapus produk ini?</h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteProduct}>
                  Hapus
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Batal
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {showToast && (
          <div className="fixed top-0 right-0 gap-4">
            <Toast color="success" className="bg-red-600 dark:bg-red-600 w-72">
              <HiCheckBadge className="w-8 h-8 text-white" />
              <div className="ml-3 text-sm font-semibold text-white">Produk berhasil dihapus</div>
              <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
            </Toast>
          </div>
        )}
      </div>
    </div>
  );
}
