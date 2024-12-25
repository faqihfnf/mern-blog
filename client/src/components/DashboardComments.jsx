import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Pagination, Modal, Button, Toast } from "flowbite-react";
import { FaExclamationCircle } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

export default function DashboardComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const commentsPerPage = 10;

  useEffect(() => {
    setShowToast(false);
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const startIndex = (currentPage - 1) * commentsPerPage;
        const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}&limit=${commentsPerPage}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setIsLoading(false);
        } else {
          setError("Failed to fetch comments");
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Error fetching comments:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchComments();
    } else {
      setIsLoading(false);
    }
  }, [currentUser?.isAdmin, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalPages = Math.ceil(totalComments / commentsPerPage);

  // Menghitung showing page info
  const startIndex = (currentPage - 1) * commentsPerPage + 1;
  const endIndex = Math.min(startIndex + commentsPerPage - 1, totalComments);

  const handleDeleteComments = async () => {
    try {
      const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setTotalComments((prev) => prev - 1);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    } finally {
      setShowModal(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return <p className="p-4">Anda tidak memiliki akses ke halaman ini</p>;
  }

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  if (!comments || comments.length === 0) {
    return <p className="p-4">Tidak ada komentar untuk saat ini</p>;
  }

  return (
    <div className="flex w-full p-8 min-h-screen">
      <div className="flex-1 lg:w-3/4 table-auto overflow-x-scroll mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Table hoverable={true} className="shadow-lg">
              <Table.Head className="text-center">
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {comments.map((comment) => (
                  <Table.Row key={comment._id} className="bg-white dark:border-slate-700 dark:bg-slate-800">
                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="line-clamp-1">{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes || 0}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        className="text-red-600 font-semibold hover:underline cursor-pointer"
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className="mt-auto pt-5">
            <div className="text-sm text-center text-slate-800 dark:text-slate-200">
              Showing {startIndex} to {endIndex} of {totalComments} entries
            </div>
            <div className="flex overflow-x-auto sm:justify-center mt-2">
              <Pagination currentPage={currentPage} totalPages={Math.max(1, Math.ceil(totalComments / commentsPerPage))} onPageChange={onPageChange} showIcons={true} />
            </div>
          </div>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <FaExclamationCircle className="text-6xl text-gray-500 mb-4 mx-auto" />
              <h3 className="mb-5 text-xl font-normal text-gray-500">Apakah anda yakin ingin menghapus komentar ini?</h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteComments}>
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
              <div className="ml-3 text-sm font-semibold text-white">Komentar berhasil dihapus</div>
              <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
            </Toast>
          </div>
        )}
      </div>
    </div>
  );
}
