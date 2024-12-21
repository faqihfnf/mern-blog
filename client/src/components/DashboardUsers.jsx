import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Pagination, Modal, Button, Toast } from "flowbite-react";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

export default function DashboardUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const usersPerPage = 5;

  useEffect(() => {
    setShowToast(false);
    const fetchUsers = async () => {
      try {
        const startIndex = (currentPage - 1) * usersPerPage;
        const res = await fetch(`/api/user/getusers?startIndex=${startIndex}&limit=${usersPerPage}`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Menghitung showing page info
  const startIndex = (currentPage - 1) * usersPerPage + 1;
  const endIndex = Math.min(startIndex + usersPerPage - 1, totalUsers);

  const handleDeleteUser = async () => {
    setShowModal(false);
    setShowToast(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setTotalUsers((prev) => prev - 1);
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
        {currentUser.isAdmin && users.length > 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Table hoverable={true} className="shadow-lg">
                <Table.Head>
                  <Table.HeadCell>Date Created</Table.HeadCell>
                  <Table.HeadCell>User Image</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {users.map((user) => (
                    <Table.Row key={user._id} className="bg-white dark:border-slate-700 dark:bg-slate-800">
                      <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <img src={user.profilePicture} alt={user.username} className="w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover bg-gray-400" />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user.isAdmin ? <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> : <FaTimesCircle className="w-5 h-5 text-red-600" />}</Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-600 font-semibold hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
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
                Showing {startIndex} to {endIndex} of {totalUsers} entries
              </div>
              <div className="flex overflow-x-auto sm:justify-center mt-2">
                <Pagination currentPage={currentPage} totalPages={Math.max(1, totalPages)} onPageChange={onPageChange} showIcons={true} />
              </div>
            </div>
          </div>
        ) : (
          <p>Tidak ada user untuk saat ini</p>
        )}
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <FaExclamationCircle className="text-6xl text-gray-500 mb-4 mx-auto" />
              <h3 className="mb-5 text-xl font-normal text-gray-500">Apakah anda yakin ingin menghapus user ini?</h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
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
              <div className="ml-3 text-lg font-semibold text-white">User berhasil dihapus </div>
              <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
            </Toast>
          </div>
        )}
      </div>
    </div>
  );
}
