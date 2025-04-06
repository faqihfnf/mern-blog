import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { BsEyeFill } from "react-icons/bs";
import { FaComments } from "react-icons/fa";

export default function PostList({ post }) {
  return (
    <div className="rounded-md shadow-indigo-500/10 border shadow-xl transition hover:border-teal-500 hover:shadow-teal-500/30 flex justify-between p-2 h-[450px] md:h-[275px] md:w-[800px]">
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
        {/* Containe Gambar */}
        <div className="relative p-1 w-full sm:w-[300px] h-[200px] sm:h-[250px] flex-shrink-0">
          <Link to={`/post/${post.slug}`}>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover rounded-md transition duration-300 hover:scale-105"
              loading="lazy"
            />
          </Link>
          <div className="absolute top-2 left-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/90 text-slate-800 px-2 py-1 rounded">
              {new Date(post.createdAt).getFullYear()}
            </span>
          </div>
        </div>
        {/* Container Text */}
        <div className="flex flex-col p-1 justify-between h-[250px] gap-2 w-full sm:w-[600px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 items-center p-1 lg:p-0">
                <span className="bg-indigo-700 dark:bg-indigo-800 text-white dark:text-indigo-100 text-xs font-medium p-1 rounded">
                  {post.category}
                </span>
                <span className="flex gap-1 items-center text-md">
                  <BsEyeFill />
                  {post.views}
                </span>
                <span className="flex gap-1 items-center text-md">
                  <FaComments />
                  {post.commentCount}
                </span>
              </div>
              <span className="text-sm text-gray-500 p-1 lg:p-0">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date(post.createdAt))}
              </span>
            </div>
            <Link to={`/post/${post.slug}`}>
              <h2 className="text-xl sm:text-2xl font-bold line-clamp-2 p-1 lg:p-0">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 p-1 lg:p-0">
              {post.content.replace(/<[^>]*>/g, "")}
            </p>
          </div>
          {/* Button Baca Selengkapnya */}
          <div className="flex sm:justify-end w-full">
            <Link to={`/post/${post.slug}`} className="w-full sm:w-auto">
              <Button
                gradientDuoTone="purpleToBlue"
                className="font-semibold w-full">
                <div className="flex items-center gap-2">
                  Baca Selengkapnya <FaArrowUpRightFromSquare />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
