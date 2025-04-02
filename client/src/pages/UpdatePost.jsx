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
  deleteObject,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { HiCheckBadge } from "react-icons/hi2";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    content: "",
    _id: "",
  });
  const [publishError, setPublishError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  console.log("Product ID from URL:", postId);

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

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
          console.log(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);

      // Hapus gambar lama jika ada
      if (formData.image) {
        try {
          // Ekstrak nama file dari URL
          const oldFileNameWithParams = formData.image.split("/o/")[1];
          const oldFileName = oldFileNameWithParams.split("?")[0];
          const decodedOldFileName = decodeURIComponent(oldFileName);

          // Buat referensi ke file lama
          const oldFileRef = ref(storage, decodedOldFileName);

          // Hapus file lama
          await deleteObject(oldFileRef);
          console.log("Gambar lama berhasil dihapus");
        } catch (deleteError) {
          console.error("Gagal menghapus gambar lama:", deleteError);
        }
      }

      // Proses upload gambar baru
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
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowToast(false);
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setShowToast(true);
        setTimeout(() => {
          navigate(
            formData.isDraft ? `/dashboard?tab=draft` : `/post/${data.slug}`
          );
        }, 3000);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }>
            <option value={formData.category}>{formData.category}</option>
            {categories.map((category) => (
              <option key={category._id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
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
            onClick={handleUpdloadImage}
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
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-96 object-cover"
          />
        )}
        <EditorToolbar />
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-96"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData.content}
          modules={modules}
          formats={formats}
        />

        {/* Tags */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Tags (pisahkan dengan koma)"
            id="tags"
            className="flex-1"
            value={formData.tags}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-center gap-4">
          <ToggleSwitch
            checked={formData.isDraft}
            label="Simpan Sebagai Draft"
            // value={formData.isDraft}
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

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
      {/* Toast */}
      {showToast && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast
            color="success"
            className="bg-green-500 dark:bg-green-500 w-72">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-3 text-lg font-semibold text-white">
              Post berhasil diupdate{" "}
            </div>
            <Toast.Toggle className="bg-opacity-15 hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
    </div>
  );
}
