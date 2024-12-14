import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      {/*left side */}
      <div className="flex flex-col md:flex-row md:items-center gap-5 p-3 max-w-3xl mx-auto">
        <div className="flex-1">
          <Link to="/" className="dark:text-white">
            <div className="flex items-center">
              <img src="/logo.png" className="mr-2 h-12" alt="Flowbite Logo" />
              <span className="font-bold text-4xl font-poppins">Marifah</span>
            </div>
          </Link>
          <p className="font-poppins font-semibold text-md mt-4">Silahkan Sign Up dengan menggunakan email dan password anda</p>
        </div>

        {/*right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Email" />
              <TextInput type="email" placeholder="Masukan Email" id="username" />
            </div>
            <div>
              <Label value="Password" />
              <TextInput type="text" placeholder="Masukan Password" id="username" />
            </div>
            <Button outline gradientDuoTone="greenToBlue" type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-md mt-4">
            <span className="font-semibold">Sudah punya akun?</span>
            <Link to={"/sign-in"} className="text-blue-500 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
