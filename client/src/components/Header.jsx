import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import { FaPlus } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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
  };

  return (
    <Navbar className="border-b-2">
      <Link to="/" className="dark:text-white">
        <div className="flex items-center">
          <img
            src="/logo.png"
            className="m-2"
            height={40}
            width={40}
            alt="marifah Logo"
          />
          <span className="font-bold text-3xl text-cyan-950 dark:text-slate-200">
            marifah.id
          </span>
        </div>
      </Link>
      {currentUser?.isAdmin && (
        <Link to={"/create-post"}>
          <Button
            gradientDuoTone="purpleToPink"
            className="w-12 h-10 rounded-full"
            title="Create Post">
            <span className="text-xl">
              <FaPlus className="font-bold" />
            </span>
          </Button>
        </Link>
      )}
      <form onSubmit={handleSearch}>
        <TextInput
          className="w-72 hidden lg:inline"
          type="text"
          placeholder="Cari Artikel..."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div className="flex items-center gap-4 md:order-2">
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>{" "}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture}
                rounded
                size="md"
              />
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
            <Button outline gradientDuoTone="tealToLime">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <div className="flex items-center">
        <Navbar.Collapse>
          {currentUser?.isAdmin && (
            <Navbar.Link
              active={path === "/dashboard"}
              as={"div"}
              className="text-lg font-semibold bg-transparent">
              <Link
                to="/dashboard?tab=overview"
                className={`font-poppins hover:text-indigo-500 ${
                  path === "/dashboard"
                    ? "text-indigo-600"
                    : "dark:text-slate-200 dark:hover:text-indigo-400"
                }`}>
                Dashboard
              </Link>
            </Navbar.Link>
          )}

          <Navbar.Link
            active={path === "/"}
            as={"div"}
            className="text-lg font-semibold bg-transparent">
            <Link
              to="/"
              className={`font-poppins hover:text-indigo-500 ${
                path === "/"
                  ? "text-indigo-600"
                  : "dark:text-slate-200 dark:hover:text-indigo-400"
              }`}>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link
            active={path === "/about"}
            as={"div"}
            className="text-lg font-semibold bg-transparent">
            <Link
              to="/about"
              className={`font-poppins hover:text-indigo-500 ${
                path === "/about"
                  ? "text-indigo-600"
                  : "dark:text-slate-200 dark:hover:text-indigo-400"
              }`}>
              About
            </Link>
          </Navbar.Link>
          <Navbar.Link
            active={path === "/product"}
            as={"div"}
            className="text-lg font-semibold bg-transparent">
            <Link
              to="/product"
              className={`font-poppins hover:text-indigo-500 ${
                path === "/product"
                  ? "text-indigo-600"
                  : "dark:text-slate-200 dark:hover:text-indigo-400"
              }`}>
              Product
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
