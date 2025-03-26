import { Badge, Carousel, Dropdown, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import ButtonScrollToTop from "../components/ButtonScrollToTop";
import SEO from "../components/SEO";
import {
  FaComments,
  FaLinkedin,
  FaShareNodes,
  FaSquareFacebook,
  FaSquareWhatsapp,
  FaSquareXTwitter,
} from "react-icons/fa6";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { HiLink } from "react-icons/hi2";
import PostCard from "./../components/PostCard";
import { FcShare } from "react-icons/fc";
import { BsEyeFill } from "react-icons/bs";
import Banner from "../components/Banner";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner/getbanner");
        const data = await res.json();
        if (res.ok) {
          setBanners(data.banners);
        }
      } catch (error) {}
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const incrementPostViews = async () => {
      if (!post?._id) return;
      try {
        await fetch(`/api/post/incrementViews/${post._id}`, {
          method: "POST",
        });
      } catch (error) {
        console.log(error);
      }
    };

    incrementPostViews();
  }, [post?._id]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post || !post.category) return;
      try {
        // Pertama, ambil semua artikel dengan kategori yang sama
        const res = await fetch(`/api/post/getposts?category=${post.category}`);
        const data = await res.json();

        if (res.ok) {
          // Filter artikel yang sedang dibuka
          const sameCategoyPosts = data.posts.filter((p) => p._id !== post._id);

          if (sameCategoyPosts.length >= 3) {
            // Jika ada 3 atau lebih artikel dengan kategori yang sama,
            // ambil 3 artikel pertama
            setRecentPosts(sameCategoyPosts.slice(0, 3));
          } else {
            // Jika artikel dengan kategori yang sama kurang dari 3,
            // ambil artikel tambahan dari kategori lain
            const remainingCount = 3 - sameCategoyPosts.length;
            const additionalRes = await fetch(
              `/api/post/getposts?limit=${remainingCount}`
            );
            const additionalData = await additionalRes.json();

            if (additionalRes.ok) {
              const additionalPosts = additionalData.posts.filter(
                (p) =>
                  p._id !== post._id && // Bukan artikel yang sedang dibuka
                  p.category !== post.category && // Bukan dari kategori yang sama
                  !sameCategoyPosts.some((sp) => sp._id === p._id) // Belum ada di daftar artikel terkait
              );

              // Gabungkan artikel dengan kategori yang sama dan artikel tambahan
              setRecentPosts([
                ...sameCategoyPosts,
                ...additionalPosts.slice(0, remainingCount),
              ]);
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRelatedPosts();
  }, [post]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  // Fungsi untuk membersihkan HTML tags untuk description
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Fungsi untuk mengambil excerpt dari content
  const getExcerpt = (content, maxLength = 160) => {
    const strippedContent = stripHtml(content);
    if (strippedContent.length <= maxLength) return strippedContent;
    return strippedContent.substring(0, maxLength).trim() + "...";
  };

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {post && (
        <SEO
          title={` marifah.id | ${post.title}`}
          description={getExcerpt(post.content)}
          keywords={`${post.category}, islam, artikel islami, ${post.title}`}
          image={post.image}
        />
      )}
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-4xl mt-10 mb-3 text-center mx-auto font-poppins lg:text-5xl">
          {post && post.title}
        </h1>
        <Link
          className="flex bg-indigo-600 hover:bg-indigo-700 rounded-md p-5 w-56 h-10 justify-center mt-4"
          to={`/search?category=${post && post.category}`}>
          <span className="text-white font-semibold items-center flex justify-center ">
            {post && post.category}
          </span>
        </Link>
      </div>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="object-cover w-full max-h-[500px] mt-4 rounded-md"
      />
      <div className="flex justify-between mt-2 border-b border-slate-600 mx-auto w-full p-3">
        <span>
          {post &&
            new Date(post.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </span>
        <div className="flex items-center gap-4">
          <Dropdown
            placement="top"
            dismissOnClick={false}
            renderTrigger={() => (
              <span className="text-2xl cursor-pointer">
                <FcShare />
              </span>
            )}>
            <Dropdown.Item>
              <CopyToClipboard
                text={`${window.location.origin}/post/${post?.slug}`}
                onCopy={() => setIsCopied(true)}>
                <button className="flex items-center gap-2 hover:text-gray-600">
                  <span className="flex items-center font-semibold gap-2 hover:text-indigo-600 dark:hover:text-pink-600 text-lg">
                    <HiLink size={20} />
                    Copy Link
                  </span>
                  {isCopied && <Badge color="success">Copied</Badge>}
                </button>
              </CopyToClipboard>
            </Dropdown.Item>
            <Dropdown.Item>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${window.location.origin}/post/${post?.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-semibold gap-2 hover:text-indigo-600 dark:hover:text-pink-600 text-lg">
                <FaSquareFacebook size={20} />
                Bagikan di Facebook
              </a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${window.location.origin}/post/${post?.slug}`
                )}&text=${encodeURIComponent(post?.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-semibold gap-2 hover:text-indigo-600 dark:hover:text-pink-600 text-lg">
                <FaSquareXTwitter size={20} />
                Bagikan di X
              </a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                  `${window.location.origin}/post/${post?.slug}`
                )}&title=${encodeURIComponent(post?.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-semibold gap-2 hover:text-indigo-600 dark:hover:text-pink-600 text-lg">
                <FaLinkedin size={20} />
                Bagikan di LinkedIn
              </a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${window.location.origin}/post/${post?.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-semibold gap-2 hover:text-indigo-600 dark:hover:text-pink-600 text-lg">
                <FaSquareWhatsapp size={20} />
                Bagikan di WhatsApp
              </a>
            </Dropdown.Item>
          </Dropdown>
          <span className="flex gap-1 items-center text-lg">
            <BsEyeFill />
            {post.views}
          </span>
          <span className="flex gap-1 items-center text-lg">
            <FaComments />
            {post.commentCount}
          </span>
          <span className="bg-indigo-200 dark:bg-indigo-600 text-indigo-600 dark:text-indigo-200 text-xs font-medium p-1 rounded">
            {post && post.category}
          </span>
        </div>
      </div>
      <div
        className="p-3 max-auto post-content text-justify"
        dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
      <div className="p-5 rounded-md bg-amber-100 dark:bg-slate-700">
        <Carousel slide={true} slideInterval={5000} className="h-full">
          {banners.map((banner) => (
            <Banner key={banner._id} banner={banner} />
          ))}
        </Carousel>
      </div>
      <div>
        <CommentSection postId={post._id} />
      </div>
      <div className=" justify-center items-center mb-10">
        <h1 className="text-center bg-gradient-to-r from-green-400 via-cyan-500 to-indigo-800 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          Artikel Terkait
        </h1>
        <div className="grid  md:grid-cols-3 sm:grid-cols-1 items-center justify-center gap-5 mt-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        <ButtonScrollToTop />
      </div>
    </main>
  );
}
