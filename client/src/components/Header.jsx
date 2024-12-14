import { Button, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import SignIn from "../pages/SignIn";

export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link to="/" className="dark:text-white">
        <div className="flex items-center">
          <img src="/logo.png" className="mr-2 h-9" alt="Flowbite Logo" />
          <span className="font-bold text-3xl font-poppins text-cyan-950">marifah.or.id</span>
        </div>
      </Link>
      <form>
        <TextInput className="w-72 hidden lg:inline" type="text" placeholder="Search..." rightIcon={AiOutlineSearch} />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex items-center gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to={SignIn}>
          <Button outline gradientDuoTone="tealToLime">
            Sign In
          </Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"} className="text-lg font-semibold">
          <Link to="/" className="font-poppins">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"} className="text-lg font-semibold">
          <Link to="/about" className="font-poppins">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/book"} as={"div"} className="text-lg font-semibold">
          <Link to="/book" className="font-poppins">
            Book
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
