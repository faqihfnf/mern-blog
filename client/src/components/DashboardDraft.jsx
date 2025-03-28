import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Pagination, Modal, Button, Toast } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaPlus } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../firebase";

export default function DashboardDrafts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userDrafts, setUserDrafts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDrafts, setTotalDrafts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [draftIdToDelete, setDraftIdToDelete] = useState(null);
  const draftsPerPage = 6;

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser._id}&page=${currentPage}&limit=${draftsPerPage}&draft=true`
        );
        const data = await res.json();
        if (res.ok) {
          setUserDrafts(data.posts);
          setTotalDrafts(data.totalPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchDrafts();
    }
  }, [currentUser._id, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalDrafts / draftsPerPage);

  const startIndex = (currentPage - 1) * draftsPerPage + 1;
  const endIndex = Math.min(startIndex + draftsPerPage - 1, totalDrafts);

  const handleDeleteDraft = async () => {
    setShowModal(false);

    const storage = getStorage(app);

    try {
      const draftToDelete = userDrafts.find(
        (draft) => draft._id === draftIdToDelete
      );

      if (draftToDelete && draftToDelete.image) {
        try {
          const imageUrl = draftToDelete.image;
          const fileNameWithParams = imageUrl.split("/o/")[1];
          const fileName = fileNameWithParams.split("?")[0];
          const decodedFileName = decodeURIComponent(fileName);

          const fileRef = ref(storage, decodedFileName);
          await deleteObject(fileRef);
        } catch (storageError) {
          console.error("Error deleting image from storage:", storageError);
        }
      }

      const res = await fetch(
        `/api/post/deletepost/${draftIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setUserDrafts((prev) =>
          prev.filter((draft) => draft._id !== draftIdToDelete)
        );
        setTotalDrafts((prev) => prev - 1);
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex w-full p-8 min-h-screen">
      <div className="flex-1 lg:w-3/4 table-auto overflow-x-scroll mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.isAdmin && userDrafts.length > 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Table hoverable className="shadow-lg">
                <Table.Head>
                  <Table.HeadCell>Date Created</Table.HeadCell>
                  <Table.HeadCell>Image</Table.HeadCell>
                  <Table.HeadCell>Draft Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {userDrafts.map((draft) => (
                    <Table.Row
                      key={draft._id}
                      className="bg-white dark:border-slate-700 dark:bg-slate-800">
                      <Table.Cell>
                        {new Date(draft.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        {draft.image && (
                          <img
                            src={draft.image}
                            alt={draft.title}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to={`/update-post/${draft._id}`}
                          className="font-medium text-slate-900 dark:text-white line-clamp-2">
                          {draft.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{draft.category}</Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setDraftIdToDelete(draft._id);
                          }}
                          className="text-red-600 font-semibold hover:underline cursor-pointer">
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to={`/update-draft/${draft._id}`}
                          className="text-teal-600 font-semibold hover:underline">
                          Edit
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            <div className="mt-auto pt-5">
              <div className="text-sm text-center text-slate-800 dark:text-slate-200">
                Showing {startIndex} to {endIndex} of {totalDrafts} entries
              </div>
              <div className="flex overflow-x-auto sm:justify-center mt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(1, totalPages)}
                  onPageChange={onPageChange}
                  showIcons
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No drafts available</p>
        )}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <FaExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to delete this draft?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteDraft}>
                  Delete
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Cancel
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
              <div className="ml-3 text-sm font-semibold text-white">
                Draft berhasil dihapus{" "}
              </div>
              <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
            </Toast>
          </div>
        )}{" "}
      </div>
    </div>
  );
}
