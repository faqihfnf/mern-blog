import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashboardProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
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

    setImageFileUploadError(null);
    setImageFileUploadProgress(null);
    // # rules firebase storage
    //     service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       requestq.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadProgress(null);
        setImageFileUploadError("Tidak bisa upload gambar (File Max 2MB)");
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-4xl font-bold text-center my-2">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden></input>
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden my-2" onClick={() => filePickerRef.current.click()}>
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
                  stroke: `rgba(62, 180, 250, ${imageFileUploadProgress / 100})`,
                  strokeLinecap: "round",
                  transition: "stroke-dashoffset 850ms ease 0s",
                },
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="User" className={`w-full h-full rounded-full object-cover border-8 border-gray-300 {imageFileUploadProgress < 100 && "opacity-50" : ''}`} />
        </div>
        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
        <TextInput type="text" id="username" placeholder="Username" defaultValue={currentUser.username} />
        <TextInput type="email" id="email" placeholder="Email" defaultValue={currentUser.email} />
        <TextInput type="text" id="password" placeholder="Password" />
        <Button type="submit" outline gradientDuoTone="purpleToBlue">
          Update Profile
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-3 font-semibold ">
        <span className="cursor-pointer hover:text-red-600">Delete Account</span>
        <span className="cursor-pointer hover:text-red-600">Sign Out</span>
      </div>
    </div>
  );
}
