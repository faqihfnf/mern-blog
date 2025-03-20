import React, { useEffect, useState } from "react";
import { HiDocumentText, HiOutlineUserGroup } from "react-icons/hi2";
import { HiAnnotation, HiArrowNarrowUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

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
    <div className="max-w-7xl mx-auto py-7">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Users Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">
                Total Users
              </h3>
              <p className="text-3xl font-bold mt-2">{totalUsers}</p>
            </div>
            <div className="bg-teal-600 rounded-full p-3">
              <HiOutlineUserGroup className="text-white w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <HiArrowNarrowUp className="text-green-600 dark:text-green-400 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              {lastMonthUsers}
            </span>
            <span className="text-gray-500 ml-2">Last Month</span>
          </div>
        </div>

        {/* Total Comments Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">
                Total Comments
              </h3>
              <p className="text-3xl font-bold mt-2">{totalComments}</p>
            </div>
            <div className="bg-indigo-600 rounded-full p-3">
              <HiAnnotation className="text-white w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <HiArrowNarrowUp className="text-green-600 dark:text-green-400 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              {lastMonthComments}
            </span>
            <span className="text-gray-500 ml-2">Last Month</span>
          </div>
        </div>

        {/* Total Posts Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">
                Total Posts
              </h3>
              <p className="text-3xl font-bold mt-2">{totalPosts}</p>
            </div>
            <div className="bg-pink-600 rounded-full p-3">
              <HiDocumentText className="text-white w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <HiArrowNarrowUp className="text-green-600 dark:text-green-400 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              {lastMonthPosts}
            </span>
            <span className="text-gray-500 ml-2">Last Month</span>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Button outline gradientDuoTone="tealToLime" size="sm">
              <Link to={"/dashboard?tab=users"}>View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:bg-slate-800">
                  <Table.Cell>
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={user.profilePicture}
                      alt={user.username}
                    />
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {user.username}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent Comments Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6">
            <h2 className="text-lg font-semibold">Recent Comments</h2>
            <Button outline gradientDuoTone="purpleToBlue" size="sm">
              <Link to={"/dashboard?tab=comments"}>View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            <Table.Body className="">
              {comments.map((comment) => (
                <Table.Row
                  key={comment._id}
                  className="bg-white dark:bg-slate-800">
                  <Table.Cell>
                    <p className="line-clamp-3">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent Posts Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Button outline gradientDuoTone="pinkToOrange" size="sm">
              <Link to={"/dashboard?tab=posts"}>View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {posts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:bg-slate-800">
                  <Table.Cell>
                    <img
                      className="w-10 h-10 rounded-lg object-cover"
                      src={post.image}
                      alt={post.title}
                    />
                  </Table.Cell>
                  <Table.Cell className="mt-2 font-medium line-clamp-3">
                    {post.title}
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
