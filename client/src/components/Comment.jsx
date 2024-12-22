import React, { useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike }) {
  const [user, setUser] = useState({});
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
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img className="w-12 h-12 rounded-full shadow-sm object-cover" src={user.profilePicture} alt={user.username} />
      </div>
      <div className="flex-1 ">
        <div className="flex items-center mb-2">
          <span className="font-bold mr-1 truncate">{user ? `@${user.username}` : "Anonymous"}</span>
          <span className="text-gray-500 ">{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className="text-gray-600 pb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-sm border-t dark:border-gray-700 w-20 gap-3 ">
          <button onClick={() => onLike(comment._id)} type="button" className={`text-gray-500 hover:text-indigo-500 ${currentUser && comment.likes.includes(currentUser._id) && "text-indigo-500"}`}>
            <FaThumbsUp className="text-md" />
          </button>
          <p className="text-gray-500 items-center mt-0.5">{comment.numberOfLikes > 0 && comment.numberOfLikes + "" + (comment.numberOfLikes > 1 ? " likes" : " like")}</p>
        </div>
      </div>
    </div>
  );
}
