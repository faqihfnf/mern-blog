import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { AiOutlineSearch } from "react-icons/ai";
import ButtonScrollToTop from "../components/ButtonScrollToTop";
import GradientColor from "../components/GradientColor";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "asc",
    category: "",
  });
  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("order");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 6) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "asc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("order", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

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

  return (
    <div className="flex flex-col md:flex-row">
      <GradientColor />
      <div className="p-4 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-4 w-full  lg:w-72" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="whitespace-nowrap font-semibold">Search:</label>
            <TextInput placeholder="Search..." id="searchTerm" type="text" value={sidebarData.searchTerm} onChange={handleChange} rightIcon={AiOutlineSearch} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id="category">
              <option value="uncategorized">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="tealToLime">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl items-center flex justify-center font-bold sm:border-b border-gray-500 p-3 ">Semua Artikel</h1>
        <div className="w-full items-center justify-center flex">
          <div className="p-7 flex flex-wrap items-center justify-center gap-4">
            {!loading && posts.length === 0 && <p className="text-xl text-gray-500">Artikel tidak ditemukan</p>}
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
            {showMore && (
              <button onClick={handleShowMore} className="text-teal-500 font-semibold text-xl hover:underline p-7 w-full">
                Lihat Semua
              </button>
            )}
          </div>
        </div>
      </div>
      <ButtonScrollToTop />
    </div>
  );
}
