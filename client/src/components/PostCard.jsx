import { Button } from "flowbite-react";
import React from "react";
import { BsEyeFill } from "react-icons/bs";
import { FaArrowUpRightFromSquare, FaComments } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="w-full bg-slate-900 rounded-lg overflow-hidden shadow-indigo-500/10 border shadow-xl transition hover:border-teal-500 hover:shadow-teal-500/30">
      {/* Container Gambar dengan tinggi tetap */}
      <div className="relative h-44">
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-2 left-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/90 text-slate-800 px-2 py-1 rounded">
            {new Date(post.createdAt).getFullYear()}
          </span>
        </div>
      </div>

      {/* Bagian Metadata (Tanggal dan Kategori) */}
      <div className="flex justify-between p-2">
        <span className="text-md text-gray-400">
          {post.createdAt &&
            new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(post.createdAt))}
        </span>
        <div className="flex gap-2 items-center">
          <span className="whitespace-nowrap font-medium rounded-md bg-indigo-200 px-2.5 py-0.5 mb-1 text-xs ">
            {post.category}
          </span>
          <span className="flex gap-1 items-center text-md text-gray-200">
            <BsEyeFill />
            {post.views}
          </span>
          <span className="flex gap-1 items-center text-md text-gray-200">
            <FaComments />
            {post.commentCount}
          </span>
        </div>
      </div>

      {/* Container Konten dengan tinggi tetap */}
      <div className="p-2 min-h-[180px] flex flex-col justify-between">
        {/* Judul dan Konten */}
        <div>
          <div className="h-[60px] mb-1">
            <h2 className="text-white text-xl font-medium mb-3 line-clamp-2">
              {post.title}
            </h2>
          </div>
          <p className="text-gray-400 line-clamp-2">
            {post.content.replace(/<[^>]*>/g, "")}
          </p>
        </div>

        {/* Tombol di bagian bawah */}
        <div>
          <Link to={`/post/${post.slug}`}>
            <Button
              gradientDuoTone="tealToLime"
              className="font-semibold w-full">
              <div className="flex items-center justify-center gap-2">
                Baca Selengkapnya <FaArrowUpRightFromSquare />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
