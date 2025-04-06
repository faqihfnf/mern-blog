import { Alert, Button, Modal, TextInput, Toast } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { HiCheckBadge } from "react-icons/hi2";

export default function DashboardProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    if (imageFile.size > 2 * 1024 * 1024) {
      setImageFileUploadError("Tidak bisa upload gambar (File Max 2MB)");
      setImageFileUploadProgress(null);
      setImageFileUrl(null);
      return; // Hentikan proses upload
    }

    setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageFileUploadProgress(null);

    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = `profile/${new Date().getTime()}-${imageFile.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadProgress(null);
        setImageFileUploadError("Tidak bisa upload gambar (File Max 2MB)");
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        });
        setImageFileUploading(false);
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Tidak ada perubahan profile");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Tunggu sampai gambar selesai diupload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile berhasil diperbarui");
        setFormData({});
        // Menambahkan setTimeout agar user bisa melihat pesan sukses sebentar
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Refresh setelah 1.5 detik
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    setShowToast(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        setShowToast(true);
        setTimeout(() => {
          dispatch(deleteUserSuccess(data));
        }, 3000);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-4xl font-bold text-center my-2">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden></input>
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden my-2"
          onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 180, 250, ${
                    imageFileUploadProgress / 100
                  })`,
                  strokeLinecap: "round",
                  transition: "stroke-dashoffset 850ms ease 0s",
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="User"
            className={`w-full h-full rounded-full object-cover border-8 border-gray-300 {imageFileUploadProgress < 100 && "opacity-50" : ''}`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          disabled
        />
        <TextInput
          type="text"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          outline
          gradientDuoTone="purpleToBlue"
          disabled={loading || imageFileUploading}>
          {loading ? "Loading..." : "Update Profile"}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-3 my-3 font-semibold ">
        <span
          className="cursor-pointer hover:text-red-600"
          onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span
          className="cursor-pointer hover:text-red-600"
          onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
      {/* Toast */}
      {showToast && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast color="success" className="bg-red-600 dark:bg-red-600 w-80">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-3 text-sm font-semibold text-white">
              Account berhasil dihapus{" "}
            </div>
            <Toast.Toggle className="bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
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
              Apakah anda yakin ingin menghapus akun ini?
            </h3>
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
    </div>
  );
}
