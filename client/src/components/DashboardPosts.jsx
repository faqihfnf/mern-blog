import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
  return (
    <div className="lg:w-3/4 table-auto overflow-x-scroll md:mx-auto py-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable={true} className="shadow-lg">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>POst Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-slate-700 dark:bg-slate-800">
                  {/* Table untuk date updated */}
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  {/* Table untuk image */}
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-20 object-cover bg-gray-400" />
                    </Link>
                  </Table.Cell>
                  {/* Table untuk post title*/}
                  <Table.Cell>
                    <Link className="font-medium text-slate-900 dark:text-white" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  {/* Table untuk category*/}
                  <Table.Cell>{post.category}</Table.Cell>
                  {/* Table untuk delete button*/}
                  <Table.Cell>
                    <span className="text-red-600 font-semibold hover:underline cursor-pointer">Delete</span>
                  </Table.Cell>
                  {/* Table untuk edit button*/}
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-600 font-semibold hover:underline cursor-pointer">Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>Tidak ada post untuk saat ini</p>
      )}
    </div>
  );
}
