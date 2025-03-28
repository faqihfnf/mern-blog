import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Toast,
} from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiCheckBadge } from "react-icons/hi2";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Silahkan lengkapi semua kolom");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //# data yang dikirim ke backend dari formData
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/sign-in");
        }, 3000);
      } else {
        setErrorMessage(data.message);
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } finally {
      //# fallback untuk mengatasi error selain di try
      if (!res.ok) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/*left side */}
      <div className="flex flex-col md:flex-row md:items-center gap-5 p-3 max-w-3xl mx-auto">
        <div className="flex-1">
          <Link to="/" className="dark:text-white">
            <div className="flex items-center">
              <img src="/logo.png" className="mr-2 h-12" alt="Flowbite Logo" />
              <span className="font-bold text-4xl font-poppins text-cyan-950 dark:text-slate-200">
                marifah.id
              </span>
            </div>
          </Link>
          <p className="font-poppins font-semibold text-md mt-4">
            Silahkan Sign Up dengan menggunakan email dan password anda
          </p>
        </div>

        {/*right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Masukan Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Masukan Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />{" "}
                  <span className="pl-3">Loading ...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-md mt-4">
            <span className="font-semibold">Sudah punya akun?</span>
            <Link
              to={"/sign-in"}
              className="text-blue-500 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-2" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast
            color="success"
            className="bg-green-500 dark:bg-green-500 w-72">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-3 text-sm font-semibold text-white">
              Sign Up berhasil!{" "}
            </div>
            <Toast.Toggle className="bg-opacity-15 hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
    </div>
  );
}
