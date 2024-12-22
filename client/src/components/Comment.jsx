import React, { useState } from "react";
import moment from "moment";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
  console.log(user);
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
      </div>
    </div>
  );
}
