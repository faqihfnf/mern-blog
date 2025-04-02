import { Button, Select, TextInput, Pagination } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import ButtonScrollToTop from "../components/ButtonScrollToTop";
import GradientColor from "../components/GradientColor";
import PostCard from "../components/PostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "asc",
    category: "",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const startIndex = (currentPage - 1) * 6 + 1;
  const endIndex = Math.min(startIndex + 5, totalPosts);
  // Fetch categories
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

  // Fetch posts based on search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("order");
    const categoryFromUrl = urlParams.get("category");
    const pageFromUrl = parseInt(urlParams.get("page") || 1);

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "asc",
        category: categoryFromUrl || "",
      });
    }

    setCurrentPage(pageFromUrl);

    const fetchPosts = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(location.search);

      // Pastikan page adalah angka yang valid
      const pageParam = urlParams.get("page");
      const validPage = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

      urlParams.set("page", validPage);
      const searchQuery = urlParams.toString();

      try {
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setTotalPages(data.totalPages);
          setCurrentPage(validPage);
          setTotalPosts(data.totalPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search, currentPage]);

  // Handle input changes in sidebar
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

  // Submit search form
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("order", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    urlParams.set("page", 1); // Reset to first page on new search
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // Handle page change
  const onPageChange = (page) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <GradientColor />
      <div className="p-4 border-b md:border-r md:min-h-screen border-gray-500">
        <form
          className="flex flex-col gap-4 w-full lg:w-72"
          onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="whitespace-nowrap font-semibold">Search:</label>
            <TextInput
              placeholder="Cari Artikel..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              rightIcon={AiOutlineSearch}
            />
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
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category">
              <option value="uncategorized">Pilih Kategori</option>
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
      <div className="flex-1 flex flex-col items-center">
        <h1 className="bg-gradient-to-l from-sky-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent items-center justify-center flex p-2">
          Semua Artikel
        </h1>
        <div className="w-full items-center justify-center">
          <div className="p-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center justify-center gap-4">
            {!loading && posts.length === 0 && (
              <p className="text-xl text-gray-500">Artikel tidak ditemukan</p>
            )}
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading &&
              posts &&
              posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-auto pt-5 mb-6">
            <div className="text-sm text-center text-slate-800 dark:text-slate-200">
              Showing {startIndex} to {endIndex} of {totalPosts} entries
            </div>
            <div className="flex overflow-x-auto justify-center mt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        )}
      </div>
      <ButtonScrollToTop />
    </div>
  );
}
