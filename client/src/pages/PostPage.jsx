import { Badge, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

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
    const fetchRelatedPosts = async () => {
      if (!post || !post.category) return; // Tunggu hingga `post` tersedia
      try {
        // Ambil artikel dengan kategori yang sama
        const res = await fetch(
          `/api/post/getposts?category=${post.category}&limit=3`
        );
        const data = await res.json();

        let relatedPosts = [];
        if (res.ok) {
          relatedPosts = data.posts.filter((p) => p._id !== post._id); // Hindari artikel yang sedang dibuka
        }

        // Jika kurang dari 3, ambil artikel tambahan
        if (relatedPosts.length < 3) {
          const additionalRes = await fetch(`/api/post/getposts?limit=3`);
          const additionalData = await additionalRes.json();
          if (additionalRes.ok) {
            const additionalPosts = additionalData.posts.filter(
              (p) =>
                !relatedPosts.some((rp) => rp._id === p._id) &&
                p._id !== post._id
            ); // Hindari duplikasi
            relatedPosts = [...relatedPosts, ...additionalPosts];
          }
        }

        // Set hanya 3 artikel
        setRecentPosts(relatedPosts.slice(0, 3));
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
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl mt-10 p-3 text-center max-w-2xl mx-auto font-poppins lg:text-5xl">
        {post && post.title}
      </h1>
      <Link
        className="flex justify-center mt-4"
        to={`/search?category=${post && post.category}`}>
        <Badge
          color="purple"
          className="h-5 w-fit text-center items-center  flex font-poppins">
          {post && post.category}
        </Badge>
      </Link>
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
        <span>{post && post.category}</span>
      </div>
      <div
        className="p-3 max-auto post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
      <div className="mt-4 p-3 mx-auto">
        <CallToAction />
      </div>
      <div>
        <CommentSection postId={post._id} />
      </div>
      <div className="flex flex-col justify-center items-center mb-10">
        <h1 className="text-4xl my-5 font-semibold">Artikel Terkait</h1>
        <div className="flex flex-wrap items-center justify-center gap-5 mt-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
