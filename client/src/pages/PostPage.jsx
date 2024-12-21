import { Badge, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl mt-10 p-3 text-center max-w-2xl mx-auto font-poppins lg:text-5xl">{post && post.title}</h1>
      <Link className="flex justify-center mt-4" to={`/search?category=${post && post.category}`}>
        <Badge color="purple" className="h-5 w-fit text-center items-center  flex font-poppins">
          {post && post.category}
        </Badge>
      </Link>
      <img src={post && post.image} alt={post && post.title} className="object-cover w-full max-h-[500px] mt-4 rounded-sm" />
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
      <div className="p-3 max-auto post-content" dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
    </main>
  );
}
