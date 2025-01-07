import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import GradientColor from "../components/GradientColor";
import SEO from "../components/SEO";
import { Button } from "flowbite-react";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts?limit=5");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <SEO
        title="Marifah.id | Al-Quran dan As-Sunnah"
        description="Selamat datang di marifah.or.id, portal ilmu pengetahuan Islam yang menyajikan artikel-artikel berkualitas tentang ajaran Islam, fiqih, hadits, dan berbagai kajian islami lainnya."
        keywords="islam, ilmu islam, artikel islam, kajian islam, fiqih, hadits, quran"
        image="/logo.png" // Ganti dengan URL gambar default Anda
      />
      <div className="flex flex-col gap-6 p-16 px-3 max-w-6xl mx-auto ">
        <GradientColor />
        <h1 className="bg-gradient-to-l from-teal-600 via-indigo-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent sm:text-8xl text-center dark:from-purple-600 dark:via-sky-600 dark:to-green-300">
          Selamat Datang Para Penuntut Ilmu
        </h1>
        <p className="flex justify-center text-xl font-semibold">Bersama Tinta dan Pena sampai Berpisah dengan Dunia yang Fana</p>
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
          <Button className="items-center w-44" size="xl" gradientDuoTone="greenToBlue">
            <Link className="text-md" to={"/search"}>
              Lihat Artikel
            </Link>
          </Button>

          <Button className="items-center w-44" size="xl" outline gradientDuoTone="redToYellow">
            <Link className="text-md" to={"/product"}>
              Lihat Product
            </Link>
          </Button>
        </div>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-2 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-semibold text-center">Artikel Terbaru</h2>
            <div className="flex flex-col gap-4 items-center">
              {posts.map((post) => (
                <PostList key={post._id} post={post} />
              ))}
            </div>
            <Link to={"/search"} className="text-xl font-semibold hover:transition-transform hover:scale-110 text-teal-500 hover:underline text-center self-center">
              Lihat Semua Artikel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
