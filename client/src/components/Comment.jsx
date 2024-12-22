import React, { useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea, Toast } from "flowbite-react";
import { HiCheckBadge } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showToastEdit, setShowToastEdit] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useState(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setShowToastEdit(true);
        setTimeout(() => {
          setIsEditing(false);
          onEdit(comment, editedContent);
          setShowToastEdit(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img className="w-12 h-12 rounded-full shadow-sm object-cover" src={user.profilePicture} alt={user.username} />
      </div>
      <div className="flex-1 ">
        <div className="flex items-center mb-2">
          <span className="font-bold mr-4 truncate">{user ? `@${user.username}` : "Anonymous"}</span>
          <span className="text-gray-500 ">{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (
          <>
            <Textarea className="mb-2" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
            <div className="flex justify-end gap-2 ">
              <Button type="button" size="sm" gradientMonochrome="success" onClick={handleSave}>
                Save
              </Button>
              <Button type="button" size="sm" gradientMonochrome="failure" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 pb-2">{comment.content}</p>
            <div className="flex justify-center items-center pt-2 text-sm border-t dark:border-gray-700 max-w-fit gap-3 ">
              <button onClick={() => onLike(comment._id)} type="button" className={`text-gray-500 hover:text-indigo-500 ${currentUser && comment.likes.includes(currentUser._id) && "text-indigo-500"}`}>
                <FaThumbsUp className="w-4 h-4 mt-1" />
              </button>
              <p className="text-gray-500 items-center mt-1.5">{comment.numberOfLikes > 0 && comment.numberOfLikes + "" + (comment.numberOfLikes > 1 ? " Likes" : " Like")}</p>
              {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <>
                  <a onClick={handleEdit} className="flex gap-0.5 mt-1 items-center text-green-500 font-semibold hover:text-green-600 hover:underline hover:font-bold cursor-pointer">
                    <BiSolidMessageSquareEdit className="w-4 h-4 mt-1" />
                    <button type="button" className="mt-1">
                      Edit
                    </button>
                  </a>
                  <a onClick={() => onDelete(comment._id)} className="flex gap-0.5 mt-1 items-center text-red-500 font-semibold hover:text-red-600 hover:underline hover:font-bold cursor-pointer">
                    <RiDeleteBin2Fill className="w-4 h-4 mt-1" />
                    <button type="button" className="mt-1">
                      Delete
                    </button>
                  </a>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {/* Toast */}
      {showToastEdit && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast color="success" className="bg-green-500 gap-1 dark:bg-green-500 w-full p-5">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-1 text-sm font-semibold text-white">Komentar berhasil diubah </div>
            <Toast.Toggle className="ml-1 bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
    </div>
  );
}
