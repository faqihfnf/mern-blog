import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Toast,
  ToggleSwitch,
} from "flowbite-react";
import EditorToolbar, { modules, formats } from "../components/EditorToolbar";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { HiCheckBadge } from "react-icons/hi2";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "uncategorized",
    image: "",
    isDraft: true,
  });
  const [publishError, setPublishError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/getcategory");
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  // Image upload handler
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = `post/${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((prevData) => ({
              ...prevData,
              image: downloadURL,
            }));
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowToast(false);
    setPublishError(null);

    // Validasi minimal title
    if (!formData.title) {
      setPublishError("Judul post harus diisi");
      return;
    }

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Cek response dari server
      if (!res.ok) {
        // Gunakan pesan error dari server jika tersedia
        setPublishError(data.message || "Gagal membuat post");
        return;
      }

      // Berhasil
      setPublishError(null);
      setShowToast(true);
      setTimeout(() => {
        navigate(
          formData.isDraft ? `/dashboard?tab=draft` : `/post/${data.slug}`
        );
      }, 3000);
    } catch (error) {
      console.error("Error submit post:", error);
      setPublishError("Terjadi kesalahan: " + error.message);
    }
  };

  return (
    <div className="p-3 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        {formData.isDraft ? "Create Draft" : "Create Post"}
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title and Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Judul"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }>
            <option value="uncategorized">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category._id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Image Upload */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {/* Image Upload Error */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* Uploaded Image Preview */}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        {/* Rich Text Editor */}
        <EditorToolbar />
        <ReactQuill
          theme="snow"
          placeholder="Tulis sesuatu..."
          className="h-72"
          value={formData.content}
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          modules={modules}
          formats={formats}
        />

        <div className="flex items-center gap-4">
          <ToggleSwitch
            checked={formData.isDraft}
            label="Simpan Sebagai Draft"
            onChange={(checked) =>
              setFormData({
                ...formData,
                isDraft: checked,
              })
            }
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" gradientDuoTone="purpleToPink">
          {formData.isDraft ? "Save Draft" : "Publish Post"}
        </Button>

        {/* Error Alert */}
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast
            color="success"
            className="bg-green-500 dark:bg-green-500 w-72">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-3 text-sm font-semibold text-white">
              {formData.isDraft
                ? "Draft berhasil disimpan"
                : "Post berhasil dipublish"}
            </div>
            <Toast.Toggle className="bg-opacity-15 hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
    </div>
  );
}
