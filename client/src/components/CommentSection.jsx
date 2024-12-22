import { Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const handleSubmit = async (e) => {};
  return (
    <div className=" mx-auto w-full p-3">
      {currentUser ? (
        <div className=" flex items-center gap-1 my-5 text-slate-500 text-sm">
          <p>Login sebagai : </p>
          <img className="w-5 h-5 object-cover rounded-full" src={currentUser.profilePicture} alt={currentUser.username} />
          <Link to={`/dashboard?tab=profile`}> @{currentUser.username}</Link>
        </div>
      ) : (
        <div className=" flex items-center gap-1 font-semibold">
          Anda harus login untuk berkomentar.
          <Link to="/sign-in" className="ml-2 text-indigo-600 hover:underline">
            Silahkan Masuk
          </Link>
        </div>
      )}
      {currentUser && (
        <form className="border-2 border-teal-600 p-3 rounded-md mt-5" onSubmit={handleSubmit}>
          <Textarea type="text" placeholder="Tuliskan Komentar Anda....." rows="4" maxLength={250} className="w-full" onChange={(e) => setComment(e.target.value)} value={comment} />
          <div className="flex justify-between mt-4 ">
            <p className="text-sm text-slate-500 p-1">{250 - comment.length} karakter tersisa</p>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
