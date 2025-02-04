import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import GradientColor from "../components/GradientColor";
import SEO from "../components/SEO";
import { Button } from "flowbite-react";
import ButtonScrollToTop from "../components/ButtonScrollToTop";
import { Carousel } from "flowbite-react";
import PostPopularCard from "../components/PostPopularCard";
import { FaArrowRight } from "react-icons/fa6";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch artikel terbaru
        const recentRes = await fetch("/api/post/getposts?limit=5");
        const recentData = await recentRes.json();
        setPosts(recentData.posts);

        // Fetch artikel populer
        const popularRes = await fetch("/api/post/getpopularposts?limit=12");
        const popularData = await popularRes.json();
        setPopularPosts(popularData.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  // Function to get number of cards per slide based on screen width
  const getCardsPerSlide = () => {
    if (windowWidth >= 1280) {
      // xl breakpoint
      return 4;
    } else if (windowWidth >= 768) {
      // md breakpoint
      return 2;
    } else {
      return 1;
    }
  };

  // Create slides based on screen size
  const createSlides = () => {
    const cardsPerSlide = getCardsPerSlide();
    const slides = [];
    for (let i = 0; i < popularPosts.length; i += cardsPerSlide) {
      slides.push(popularPosts.slice(i, i + cardsPerSlide));
    }
    return slides;
  };
  return (
    <div>
      <SEO
        title="Marifah.id | Al-Quran dan As-Sunnah"
        description="Selamat datang di marifah.id, portal ilmu pengetahuan Islam yang menyajikan artikel-artikel berkualitas tentang ajaran Islam, fiqih, hadits, dan berbagai kajian islami lainnya."
        keywords="islam, ilmu islam, artikel islam, kajian islam, fiqih, hadits, quran"
        image="/logo.png" // Ganti dengan URL gambar default Anda
      />
      <div className="flex flex-col gap-6 p-16 px-3 max-w-6xl mx-auto ">
        <GradientColor />
        <h1 className="bg-gradient-to-l from-teal-600 via-indigo-600 to-pink-600 bg-clip-text font-extrabold text-transparent  text-center dark:from-purple-600 dark:via-sky-600 dark:to-green-300 mt-16 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          Selamat Datang Para Penuntut Ilmu
        </h1>
        <p className="flex justify-center text-center items-center text-2xl font-semibold mt-10 ">Bersama Tinta dan Pena hingga Berpisah dengan Dunia yang Fana</p>
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-center mb-20 mt-10">
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
      {/* Popular Posts Section */}
      {popularPosts && popularPosts.length > 0 && (
        <div className="max-w-full p-3 flex flex-col gap-2 py-7">
          <div className="flex flex-col gap-8">
            <h2 className="text-center bg-gradient-to-r from-green-400 via-cyan-500 to-indigo-800 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">Artikel Populer</h2>
            <div className="h-[500px] sm:h-[550px]">
              <Carousel slide={true} slideInterval={5000} className="h-full">
                {createSlides().map((slide, slideIndex) => (
                  <div key={slideIndex} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full p-4">
                    {slide.map((post) => (
                      <div key={post._id} className="w-full">
                        <PostPopularCard post={post} />
                      </div>
                    ))}
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      )}
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-2 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-center bg-gradient-to-r from-green-400 via-cyan-500 to-indigo-800 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">Artikel Terbaru</h2>
            <div className="flex flex-col gap-4 items-center">
              {posts.map((post) => (
                <PostList key={post._id} post={post} />
              ))}
            </div>
            <Link to={"/search"} className="text-xl font-semibold hover:transition-transform  text-indigo-600 hover:text-indigo-700 text-center self-center flex gap-2 items-center justify-center">
              <Button outline gradientDuoTone="redToYellow">
                <span className="text-lg">Lihat Semua Artikel</span>
                <FaArrowRight className="mt-1.5 ml-2 text-lg" />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <ButtonScrollToTop />
    </div>
  );
}
