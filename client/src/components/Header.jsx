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
      <Link to="/">
        <div className="flex items-center">
          <img
            src="/logo.png"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="font-bold text-3xl">Marifah</span>
        </div>
      </Link>
      <form>
        <TextInput
          className="w-72 hidden lg:inline"
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
        />
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
        <Navbar.Link
          active={path === "/"}
          as={"div"}
          className="text-lg font-bold">
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/about"}
          as={"div"}
          className="text-lg font-bold">
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/book"}
          as={"div"}
          className="text-lg font-bold">
          <Link to="/book">Book</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
