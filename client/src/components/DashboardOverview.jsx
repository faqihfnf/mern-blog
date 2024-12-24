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
              <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
              <p className="text-2xl flex justify-center mt-2">{totalComments}</p>
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
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {/* Recent Users */}
        <div className="flex flex-col p-2 w-full md:w-auto shadow-md rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className=" p-2 text-center">Recent Users</h1>
            <Button outline gradientDuoTone="tealToLime">
              <Link to={"/dashboard?tab=users"}>View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:bg-slate-800">
                    <Table.Cell>
                      <img className="w-10 h-10 rounded-full bg-gray-500" src={user.profilePicture} alt={user.username} />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/* Recent Comments */}
        <div className="flex flex-col p-2 w-full md:w-auto shadow-md rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className=" p-2 text-center">Recent Comments</h1>
            <Button outline gradientDuoTone="tealToLime">
              <Link to={"/dashboard?tab=comments"}>View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comments</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:bg-slate-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/* Recent Posts */}
        <div className="flex flex-col p-2 w-full md:w-auto shadow-md rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className=" p-2 text-center">Recent Posts</h1>
            <Button outline gradientDuoTone="tealToLime">
              <Link to={"/dashboard?tab=posts"}>View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:bg-slate-800">
                    <Table.Cell>
                      <img className="w-10 h-10 rounded-md bg-gray-500" src={post.image} alt="user" />
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
