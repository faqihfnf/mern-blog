import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Pagination, Modal, Button, Toast } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaPlus } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

export default function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const postsPerPage = 5;

  useEffect(() => {
    setShowToast(false);
    const fetchPosts = async () => {
      try {
        const startIndex = (currentPage - 1) * postsPerPage;
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}&limit=${postsPerPage}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          setTotalPosts(data.totalPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Menghitung showing page info
  const startIndex = (currentPage - 1) * postsPerPage + 1;
  const endIndex = Math.min(startIndex + postsPerPage - 1, totalPosts);

  const handleDeletePost = async () => {
    setShowModal(false);
    setShowToast(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setTotalPosts((prev) => prev - 1);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex w-full p-8 min-h-screen">
      <div className="flex-1 lg:w-3/4 table-auto overflow-x-scroll mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <div className="mb-4 w-48">
          <Link to={"/create-post"}>
            <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
              <FaPlus size={20} className="mr-2 mt-1" />
              <span className="font-poppins text-lg">Create Post</span>
            </Button>
          </Link>
        </div>
        {currentUser.isAdmin && userPosts.length > 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Table hoverable={true} className="shadow-lg">
                <Table.Head className="">
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Post Image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Views</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {userPosts.map((post) => (
                    <Table.Row key={post._id} className="bg-white dark:border-slate-700 dark:bg-slate-800">
                      <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className="w-20 h-20 object-cover bg-gray-400" />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link className="font-medium line-clamp-2 text-slate-900 dark:text-white" to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>{post.views}</Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-600 font-semibold hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-post/${post._id}`}>
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
                Showing {startIndex} to {endIndex} of {totalPosts} entries
              </div>
              <div className="flex overflow-x-auto sm:justify-center mt-2">
                <Pagination currentPage={currentPage} totalPages={Math.max(1, totalPages)} onPageChange={onPageChange} showIcons={true} />
              </div>
            </div>
          </div>
        ) : (
          <p>Tidak ada post untuk saat ini</p>
        )}
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <FaExclamationCircle className="text-6xl text-gray-500 mb-4 mx-auto" />
              <h3 className="mb-5 text-xl font-normal text-gray-500">Apakah anda yakin ingin menghapus post ini?</h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeletePost}>
                  Hapus
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Batal
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* Toast */}
        {showToast && (
          <div className="fixed top-0 right-0 gap-4">
            <Toast color="success" className="bg-red-600 dark:bg-red-600 w-72">
              <HiCheckBadge className="w-8 h-8 text-white" />
              <div className="ml-3 text-sm font-semibold text-white">Post berhasil dihapus </div>
              <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
            </Toast>
          </div>
        )}
      </div>
    </div>
  );
}
