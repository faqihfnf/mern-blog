import React, { useEffect, useState } from "react";
import { HiDocumentText, HiOutlineUserGroup } from "react-icons/hi2";
import { HiAnnotation, HiArrowNarrowUp } from "react-icons/hi";

import { useSelector } from "react-redux";

export default function DashboardOverview() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto ">
      <div className="flex flex-wrap gap-5 justify-center">
        {/* Total User */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-2 md:w-72 w-full rounded-md shadow-lg">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl flex justify-center mt-2">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 rounded-full p-3 text-5xl text-white shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        {/* Total Comments */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-2 md:w-72 w-full rounded-md shadow-lg">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl flex justify-center mt-2">
                {totalComments}
              </p>
            </div>
            <HiAnnotation className="bg-indigo-600 rounded-full p-3 text-5xl text-white shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        {/* Total Posts */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-2 md:w-72 w-full rounded-md shadow-lg">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl flex justify-center mt-2">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-pink-600 rounded-full p-3 text-5xl text-white shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-600 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
