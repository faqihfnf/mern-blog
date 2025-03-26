import {
  Alert,
  Button,
  FileInput,
  Textarea,
  TextInput,
  Toast,
} from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { HiCheckBadge } from "react-icons/hi2";

export default function UpdateBanner() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { bannerId } = useParams();
  console.log("Banner ID from URL:", bannerId);

  useEffect(() => {
    try {
      const fetchBanner = async () => {
        const res = await fetch(`/api/banner/getbanner/${bannerId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data);
          console.log(data);
        }
      };
      fetchBanner();
    } catch (error) {
      console.log(error);
    }
  }, [bannerId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
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
            setFormData({ ...formData, image: downloadURL }); // Changed from image to image
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
      const res = await fetch(`/api/banner/updatebanner/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setShowToast(true);
        setTimeout(() => {
          navigate("/dashboard?tab=banners");
        }, 3000);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update a Banner
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Banner Title"
          required
          id="title"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title}
        />
        <Textarea
          type="text"
          maxLength={250}
          rows={4}
          placeholder="Description"
          required
          id="description"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          value={formData.description}
        />
        <TextInput
          type="text"
          placeholder="Banner Link"
          required
          id="link"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          value={formData.link}
        />

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
            className="w-full h-72 object-cover"
            loading="lazy"
          />
        )}

        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={!formData.title || !formData.description || !formData.link}>
          Update
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
      {showToast && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast
            color="success"
            className="bg-green-500 dark:bg-green-500 w-72">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-3 text-sm font-semibold text-white">
              Banner berhasil diperbarui
            </div>
            <Toast.Toggle className="bg-opacity-15 hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
    </div>
  );
}
