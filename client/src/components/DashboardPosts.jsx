import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Pagination } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const startIndex = (currentPage - 1) * postsPerPage;
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}&limit=${postsPerPage}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          setTotalPosts(data.totalPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Menghitung showing page info
  const startIndex = (currentPage - 1) * postsPerPage + 1;
  const endIndex = Math.min(startIndex + postsPerPage - 1, totalPosts);

  return (
    <div className="lg:w-3/4 table-auto overflow-x-scroll md:mx-auto py-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable={true} className="shadow-lg">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row key={post._id} className="bg-white dark:border-slate-700 dark:bg-slate-800">
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-20 object-cover bg-gray-400" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-slate-900 dark:text-white" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className="text-red-600 font-semibold hover:underline cursor-pointer">Delete</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-600 font-semibold hover:underline cursor-pointer">Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {/* Pagination component */}
          {totalPages > 1 && (
            <>
              <div className="text-sm mt-5 text-center text-slate-800 dark:text-slate-200">
                Showing {startIndex} to {endIndex} of {totalPosts} entries
              </div>
              <div className="flex overflow-x-auto sm:justify-center mt-2">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons={true} />
              </div>
            </>
          )}
        </>
      ) : (
        <p>Tidak ada post untuk saat ini</p>
      )}
    </div>
  );
}
