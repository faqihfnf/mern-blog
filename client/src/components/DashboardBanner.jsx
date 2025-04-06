import { getStorage, ref, deleteObject } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Pagination, Modal, Button, Toast } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaPlus } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

export default function DashboardBanner() {
  const { currentUser } = useSelector((state) => state.user);
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBanners, setTotalBanners] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [bannerIdToDelete, setBannerIdToDelete] = useState(null);
  const bannersPerPage = 5;

  // Inisialisasi Firebase Storage
  const storage = getStorage();

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/banner/getbanner?startIndex=${currentPage}&limit=${bannersPerPage}`
        );
        const data = await res.json();
        if (res.ok) {
          setBanners(data.banners);
          setTotalPages(data.totalPages);
          setTotalBanners(data.totalBanners);
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
      fetchBanners();
    }
  }, [currentUser?._id, currentPage]);

  const onPageChange = (startIndex) => {
    setCurrentPage(startIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Menghitung showing page info
  const startIndex = (currentPage - 1) * bannersPerPage + 1;
  const endIndex = Math.min(startIndex + bannersPerPage - 1, totalBanners);

  const handleDeleteBanner = async () => {
    setShowModal(false);
    setShowToast(false);
    try {
      // Dapatkan data banner yang akan dihapus
      const bannerToDelete = banners.find(
        (banner) => banner._id === bannerIdToDelete
      );

      if (bannerToDelete) {
        // Hapus gambar dari Firebase Storage
        try {
          // Dapatkan URL gambar
          const imageUrl = bannerToDelete.image;

          // Ekstrak nama file dari URL
          // Format URL: https://firebasestorage.googleapis.com/v0/b/next-app-6af7e.appspot.com/o/1742444698204-quran.jpg?alt=media&token=...
          const fileNameWithParams = imageUrl.split("/o/")[1];
          // Ambil hanya nama file (sebelum '?')
          const fileName = fileNameWithParams.split("?")[0];
          // Decode URI untuk menangani karakter khusus
          const decodedFileName = decodeURIComponent(fileName);

          // Buat referensi ke file
          const fileRef = ref(storage, decodedFileName);

          // Hapus file
          await deleteObject(fileRef);
          console.log(
            "File gambar berhasil dihapus dari storage:",
            decodedFileName
          );
        } catch (storageError) {
          console.error(
            "Kesalahan menghapus gambar dari storage:",
            storageError
          );
        }
      }

      // Lanjutkan dengan menghapus data dari database
      const res = await fetch(`/api/banner/deletebanner/${bannerIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        // Refresh data setelah menghapus
        const refreshRes = await fetch(
          `/api/banner/getbanner?startIndex=${currentPage}&limit=${bannersPerPage}`
        );
        const refreshData = await refreshRes.json();
        setBanners(refreshData.banners);
        setTotalPages(refreshData.totalPages);
        setTotalBanners(refreshData.totalBanners);

        // Jika halaman saat ini kosong, kembali ke halaman sebelumnya
        if (refreshData.banners.length === 0 && currentPage > 1) {
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
          <Link to={"/create-banner"}>
            <Button type="button" gradientDuoTone="purpleToPink" className="">
              <FaPlus size={14} className="mr-2 mt-0.5" />
              <span className="font-poppins text-md">Create Banner</span>
            </Button>
          </Link>
        </div>
        {currentUser?.isAdmin && banners.length > 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Table hoverable={true} className="shadow-lg">
                <Table.Head className="">
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Images</Table.HeadCell>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Link</Table.HeadCell>
                  <Table.HeadCell>CTA</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {banners.map((banner) => (
                    <Table.Row
                      key={banner._id}
                      className="bg-white dark:border-slate-700 dark:bg-slate-800">
                      <Table.Cell>
                        {new Date(banner.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <img
                          src={banner.image}
                          alt={banner.name}
                          className="w-20 h-20 rounded-md object-cover bg-gray-400"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {banner.title}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="line-clamp-2">
                          {banner.description}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline">
                          View Banner
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{banner.cta}</Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-600 font-semibold hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setBannerIdToDelete(banner._id);
                          }}>
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-banner/${banner._id}`}>
                          <span className="text-teal-600 font-semibold hover:underline cursor-pointer">
                            Edit
                          </span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="mt-auto pt-5">
              <div className="text-sm text-center text-slate-800 dark:text-slate-200">
                Showing {startIndex} to {endIndex} of {totalBanners} entries
              </div>
              <div className="flex overflow-x-auto sm:justify-center mt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(1, totalPages)}
                  onPageChange={onPageChange}
                  showIcons={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <p>Tidak ada banner untuk saat ini</p>
        )}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <FaExclamationCircle className="text-6xl text-gray-500 mb-4 mx-auto" />
              <h3 className="mb-5 text-xl font-normal text-gray-500">
                Apakah anda yakin ingin menghapus banner ini?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteBanner}>
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
              <div className="ml-3 text-sm font-semibold text-white">
                Banner berhasil dihapus
              </div>
              <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
            </Toast>
          </div>
        )}
      </div>
    </div>
  );
}
