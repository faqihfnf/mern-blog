import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import GradientColor from "../components/GradientColor";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-16 px-3 max-w-6xl mx-auto ">
        <GradientColor />
        <h1 className="bg-gradient-to-l from-teal-600 via-indigo-600 to-pink-600 bg-clip-text py-10 text-3xl font-extrabold text-transparent sm:text-8xl text-center dark:from-purple-600 dark:via-sky-600 dark:to-green-300">
          Selamat Datang Para Penuntut Ilmu
        </h1>
        <p className="text-gray-500 text-sm sm:text-sm">Selamat datang di marifah.or.id</p>
        <Link to="/search" className="text-md sm:text-sm text-teal-500 font-bold hover:underline">
          Lihat Semua Artikel
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-2 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-8 justify-center items-center">
            <h2 className="text-2xl font-semibold text-center">Artikel Terbaru</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center ">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={"/search"} className="text-xl font-semibold hover:transition-transform hover:scale-110 text-teal-500 hover:underline text-center">
              Lihat Semua Artikel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
