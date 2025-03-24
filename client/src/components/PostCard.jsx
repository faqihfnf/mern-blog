import { Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";
import { FaComments } from "react-icons/fa";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full border  h-[375px] overflow-hidden sm:w-[355px] transition-all bg-purple-200/10 rounded-xl shadow-indigo-500/20 shadow-xl hover:border-teal-500 hover:shadow-teal-500/20 dark:hover:border-pink-500 dark:hover:shadow-pink-500/20 dark:border-slate-700">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-4">
        <div className="flex justify-between">
          <span className="text-md text-gray-500 ">
            {post.createdAt &&
              new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(post.createdAt))}
          </span>
          <div className="flex gap-2 items-center">
            <span className="whitespace-nowrap rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs text-indigo-600">
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
        </div>
        <h2 className="text-lg font-semibold line-clamp-2">{post.title}</h2>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md m-2 font-semibold">
          Baca Selengkapnya
        </Link>
      </div>
    </div>
  );
}
