import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import SEO from "../components/SEO";
import { Button } from "flowbite-react";
import ButtonScrollToTop from "../components/ButtonScrollToTop";
import { Carousel } from "flowbite-react";
import { FaArrowRight } from "react-icons/fa6";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner/getbanner");
        const data = await res.json();
        if (res.ok && isMounted) {
          setBanners(data.banners);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching banners:", error);
        }
      }
    };

    fetchBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        // Fetch artikel terbaru
        const recentRes = await fetch("/api/post/getposts?limit=5", {
          signal: controller.signal,
        });
        const recentData = await recentRes.json();
        setPosts(recentData.posts);

        // Fetch artikel populer
        const popularRes = await fetch("/api/post/getpopularposts?limit=12", {
          signal: controller.signal,
        });
        const popularData = await popularRes.json();
        setPopularPosts(popularData.posts);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/getcategory");
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
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
        keywords={`${categories
          .map((category) => category.name)
          .join(
            ", "
          )}, artikel islam, fiqih, hadits, kajian islami, kajian sunnah, marifah.id`}
        author="marifah.id"
        image="/logo.png" // Ganti dengan URL gambar default Anda
      />
      <div className="">
        <Hero />
      </div>

      {/* Popular Posts Section */}
      {popularPosts && popularPosts.length > 0 && (
        <div className="max-w-full p-3 flex flex-col gap-2 py-7">
          <div className="flex flex-col gap-8">
            <h2 className="text-center bg-gradient-to-r from-green-400 via-cyan-500 to-indigo-800 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Artikel Populer
            </h2>
            <div className="h-[450px] ">
              <Carousel slide={true} slideInterval={5000} className="h-full">
                {createSlides().map((slide, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 h-full p-4">
                    {slide.map((post) => (
                      <div key={post._id} className="w-full">
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      )}

      {/* Banner Section */}
      <div className="p-5 bg-amber-100 dark:bg-slate-700 mx-7 rounded-xl ">
        <Carousel slide={true} slideInterval={5000}>
          {banners.map((banner) => (
            <Banner key={banner._id} banner={banner} />
          ))}
        </Carousel>
      </div>

      {/* Latest Posts Section */}
      <div className="max-w-6xl mx-auto mt-6 p-3 flex flex-col gap-2 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-center bg-gradient-to-r from-green-400 via-cyan-500 to-indigo-800 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Artikel Terbaru
            </h2>
            <div className="flex flex-col gap-4 items-center p-5">
              {posts.map((post) => (
                <PostList key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-xl font-semibold hover:transition-transform  text-indigo-600 hover:text-indigo-700 text-center self-center flex gap-2 items-center justify-center">
              <Button outline gradientDuoTone="purpleToPink">
                <span className="">Lihat Semua Artikel</span>
                <FaArrowRight className="mt-1 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <ButtonScrollToTop />
    </div>
  );
}
