import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
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

  return (
    <Navbar className="border-b-2">
      <Link to="/" className="dark:text-white">
        <div className="flex items-center">
          <img src="/logo.png" className="mr-2 h-9" alt="Flowbite Logo" />
          <span className="font-bold text-3xl font-poppins text-cyan-950 dark:text-slate-200">marifah.or.id</span>
        </div>
      </Link>
      <form>
        <TextInput className="w-72 hidden lg:inline" type="text" placeholder="Search..." rightIcon={AiOutlineSearch} />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex items-center gap-4 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-blue-800" />}
        </Button>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}>
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block truncate text-sm font-medium">{currentUser.email}</span>
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
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"} className="text-lg font-semibold">
          <Link to="/" className="font-poppins dark:text-slate-200">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"} className="text-lg font-semibold">
          <Link to="/about" className="font-poppins dark:text-slate-200">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/book"} as={"div"} className="text-lg font-semibold">
          <Link to="/book" className="font-poppins dark:text-slate-200">
            Book
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
