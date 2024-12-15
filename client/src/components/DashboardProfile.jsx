import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";

export default function DashboardProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-4xl font-bold text-center my-2">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden my-2">
          <img src={currentUser.profilePicture} alt="User" className="w-full h-full rounded-full object-cover border-8 border-gray-300" />
        </div>
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
