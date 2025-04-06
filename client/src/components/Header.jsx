import { Avatar, Button, Dropdown, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import { FaPlus } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";
import { CgMenu } from "react-icons/cg";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setSearchTerm("");
  };

  // Function to handle toggle click
  const handleToggleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      {/* Fixed Header Bar */}
      <div className="flex justify-between items-center lg:px-4 py-2">
        {/* Logo - changed from NavbarBrand to Link */}
        <Link to="/" className="dark:text-white font-poppins">
          <div className="flex items-center">
            <img
              src="/logo.png"
              className="m-2"
              height={40}
              width={40}
              alt="marifah Logo"
            />
            <span className="font-bold text-2xl md:text-3xl text-cyan-950 dark:text-slate-200">
              marifah.id
            </span>
          </div>
        </Link>

        {/* Search Bar for large screens */}
        <div className="hidden lg:block">
          <form onSubmit={handleSearch}>
            <TextInput
              className="w-72"
              type="text"
              placeholder="Cari Artikel..."
              rightIcon={AiOutlineSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="hidden md:block">
          <div className="container mx-auto px-4">
            <nav className="flex">
              {currentUser?.isAdmin && (
                <Link
                  to="/dashboard?tab=overview"
                  className={`px-3 py-4 ${
                    path === "/dashboard"
                      ? "text-indigo-600  border-indigo-600"
                      : "text-gray-900 dark:text-slate-200 hover:text-indigo-500"
                  } font-poppins text-lg font-semibold`}>
                  Dashboard
                </Link>
              )}
              <Link
                to="/"
                className={`px-3 py-4 ${
                  path === "/"
                    ? "text-indigo-600  border-indigo-600"
                    : "text-gray-900 dark:text-slate-200 hover:text-indigo-500"
                } font-poppins text-lg font-semibold`}>
                Home
              </Link>
              <Link
                to="/about"
                className={`px-3 py-4 ${
                  path === "/about"
                    ? "text-indigo-600  border-indigo-600"
                    : "text-gray-900 dark:text-slate-200 hover:text-indigo-500"
                } font-poppins text-lg font-semibold`}>
                About
              </Link>
              <Link
                to="/product"
                className={`px-3 py-4 ${
                  path === "/product"
                    ? "text-indigo-600  border-indigo-600"
                    : "text-gray-900 dark:text-slate-200 hover:text-indigo-500"
                } font-poppins text-lg font-semibold`}>
                Product
              </Link>
            </nav>
          </div>
        </div>

        <div className="items-center hidden lg:flex">
          <ThemeToggle />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 md:gap-4">
          {/* Theme Toggle - only on large screens */}

          {/* Search Icon for mobile */}
          <div className="lg:hidden flex items-center">
            <Link
              to="/search"
              className="border-none bg-transparent"
              onClick={() => setIsMenuOpen(false)}>
              <AiOutlineSearch className="text-gray-500 w-8 h-8" />
            </Link>
          </div>

          {/* Theme Toggle for mobile */}
          <div className="lg:hidden flex items-center">
            <Link
              className="border-none bg-transparent"
              color=""
              onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? (
                <FaSun className="text-yellow-300 w-8 h-8" />
              ) : (
                <FaMoon className="text-blue-800 w-8 h-8" />
              )}
            </Link>
          </div>

          {/* Create Post button for all screens */}
          {currentUser?.isAdmin && (
            <div className="">
              {/* <Link to={"/create-post"}> */}
              <Button
                onClick={() => navigate("/create-post")}
                gradientDuoTone="purpleToPink"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
                title="Create Post">
                {/* <span className="text-md lg:text-xl"> */}
                <FaPlus className="font-bold flex items-center justify-center -mt-[2px] w-4 h-4 lg:w-6 lg:h-6" />
                {/* </span> */}
              </Button>
              {/* </Link> */}
            </div>
          )}

          {/* User Profile/Sign In */}
          <div className="">
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <>
                    {/* Avatar ukuran kecil untuk mobile */}
                    <div className="block md:hidden">
                      <Avatar
                        alt="user"
                        img={currentUser.profilePicture}
                        rounded
                        size="sm"
                      />
                    </div>
                    {/* Avatar ukuran medium untuk layar lebih besar */}
                    <div className="hidden md:block">
                      <Avatar
                        alt="user"
                        img={currentUser.profilePicture}
                        rounded
                        size="md"
                      />
                    </div>
                  </>
                }>
                <Dropdown.Header>
                  <span className="block text-sm">@{currentUser.username}</span>
                  <span className="block truncate text-sm font-medium">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                <Link to={"/dashboard?/tab=profile"}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              </Dropdown>
            ) : (
              <Link to="/sign-in">
                <Button
                  size="sm"
                  className="hidden lg:block"
                  outline
                  gradientDuoTone="tealToLime">
                  Masuk
                </Button>
              </Link>
            )}
          </div>

          {/* Toggle Button for medium and small screens */}
          <button
            onClick={handleToggleClick}
            className="md:hidden inline-flex items-center w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-menu"
            aria-expanded={isMenuOpen}>
            <span className="sr-only">Toggle menu</span>
            <CgMenu className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Collapsible Menu - Positioned as an overlay under the header */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-4 bg-white dark:bg-gray-800 shadow-lg">
            <nav>
              <ul className="space-y-2">
                {currentUser?.isAdmin && (
                  <li>
                    <Link
                      to="/dashboard?tab=overview"
                      className={`block px-3 py-2 rounded-md ${
                        path === "/dashboard"
                          ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700"
                          : "text-gray-900 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      } font-poppins text-lg font-semibold`}
                      onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/"
                    className={`block px-3 py-2 rounded-md ${
                      path === "/"
                        ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700"
                        : "text-gray-900 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } font-poppins text-lg font-semibold`}
                    onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className={`block px-3 py-2 rounded-md ${
                      path === "/about"
                        ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700"
                        : "text-gray-900 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } font-poppins text-lg font-semibold`}
                    onClick={() => setIsMenuOpen(false)}>
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product"
                    className={`block px-3 py-2 rounded-md ${
                      path === "/product"
                        ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700"
                        : "text-gray-900 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } font-poppins text-lg font-semibold`}
                    onClick={() => setIsMenuOpen(false)}>
                    Product
                  </Link>
                </li>

                {/* Search form for mobile */}
                {/* <li className="mt-4 px-3">
                  <form onSubmit={handleSearch}>
                    <TextInput
                      className="w-full"
                      type="text"
                      placeholder="Cari Artikel..."
                      rightIcon={AiOutlineSearch}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>
                </li> */}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
