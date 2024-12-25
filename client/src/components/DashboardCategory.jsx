import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, TextInput, Alert, Modal, Toast } from "flowbite-react";
import { HiCheckBadge } from "react-icons/hi2";
import { FaExclamationCircle, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function DashboardCategories() {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [currentUser]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category/getcategory");
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
      }
    } catch (error) {
      setError("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const url = editMode ? `/api/category/updatecategory/${selectedCategory._id}` : "/api/category/createcategory";

      const res = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setSuccess(editMode ? "Kategori berhasil diupdate" : "Kategori berhasil dibuat");
        setFormData({ name: "" });
        setEditMode(false);
        setSelectedCategory(null);
        setShowCreateModal(false);
        fetchCategories();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/category/deletecategory/${selectedCategory._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setShowToast(true);
        setCategories(categories.filter((cat) => cat._id !== selectedCategory._id));
        setSelectedCategory(null);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      setError(error.message);
    }
    setShowDeleteModal(false);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setEditMode(true);
    setShowCreateModal(true);
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="mb-4 w-48">
          <Button
            gradientDuoTone="purpleToPink"
            onClick={() => {
              setEditMode(false);
              setFormData({ name: "" });
              setShowCreateModal(true);
            }}
            className="w-full"
          >
            <FaPlus size={20} className="mr-2" />
            <span className="font-poppins text-md">Create Category</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="success" className="mt-5">
          {success}
        </Alert>
      )}

      <div className="mt-5">
        {categories.map((category) => (
          <div key={category._id} className="flex items-center justify-between p-3 border rounded mb-3">
            <div>
              <span className="font-semibold">{category.name}</span>
              <span className="ml-2 text-gray-500">({category.postCount} posts)</span>
            </div>
            <div className="flex gap-2">
              <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEdit(category)} />
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  setShowDeleteModal(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} popup size="md">
        <Modal.Header>{editMode ? "Edit Category" : "Create New Category"}</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <TextInput type="text" placeholder="Category Name" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} required />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit" gradientDuoTone="purpleToBlue" disabled={loading}>
                {loading ? "Loading..." : editMode ? "Update" : "Create"}
              </Button>
              <Button color="gray" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaExclamationCircle className="text-6xl text-gray-500 mb-4 mx-auto" />
            <h3 className="mb-5 text-xl font-normal text-gray-500">Apakah anda yakin ingin menghapus kategori ini?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Hapus
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast color="success" className="bg-red-600 dark:bg-red-600 w-80">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-3 text-sm font-semibold text-white">Kategori berhasil dihapus</div>
            <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
    </div>
  );
}
