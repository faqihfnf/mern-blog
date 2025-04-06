import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { HiDocumentText, HiUserGroup } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import { IoMdChatbubbles } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
import { FaChartSimple } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdCallToAction } from "react-icons/md";
import { RiDraftFill } from "react-icons/ri";

export default function DashboardSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
      const res = await fetch("api/user/signout", {
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {/* overview */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=overview">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 ${
                  tab === "overview" ? "bg-indigo-200 dark:bg-indigo-700" : ""
                }`}
                active={tab === "overview"}
                icon={FaChartSimple}
                labelColor={currentUser.isAdmin ? "green" : "blue"}
                as="div">
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {/* profile */}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                tab === "profile" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
              }`}
              active={tab === "profile"}
              icon={FaUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor={currentUser.isAdmin ? "green" : "blue"}
              as="div">
              Profile
            </Sidebar.Item>
          </Link>

          {/* posts */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                  tab === "posts" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
                }`}
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div">
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {/* draft */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=draft">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                  tab === "draft" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
                }`}
                active={tab === "draft"}
                icon={RiDraftFill}
                as="div">
                Draft
              </Sidebar.Item>
            </Link>
          )}

          {/* category */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=category">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                  tab === "category" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
                }`}
                active={tab === "category"}
                icon={BiSolidCategoryAlt}
                as="div">
                Categories
              </Sidebar.Item>
            </Link>
          )}

          {/* users */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                  tab === "users" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
                }`}
                active={tab === "users"}
                icon={HiUserGroup}
                as="div">
                Users
              </Sidebar.Item>
            </Link>
          )}

          {/* comments */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                  tab === "comments" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
                }`}
                active={tab === "comments"}
                icon={IoMdChatbubbles}
                as="div">
                Comments
              </Sidebar.Item>
            </Link>
          )}

          {/* products */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=products">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                  tab === "products" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
                }`}
                active={tab === "products"}
                icon={IoStorefront}
                as="div">
                Products
              </Sidebar.Item>
            </Link>
          )}

          {/* banners */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=banners">
              <Sidebar.Item
                className={`text-cyan-950 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-700 mt-[-5px] ${
                  tab === "banners" ? "bg-indigo-200 dark:bg-indigo-700 " : ""
                }`}
                active={tab === "banners"}
                icon={MdCallToAction}
                as="div">
                Banners
              </Sidebar.Item>
            </Link>
          )}

          {/* sign out */}
          <Sidebar.Item
            className="text-red-700 dark:text-red-700 mt-[-5px] font-semibold cursor-pointer"
            icon={FaSignOutAlt}
            onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
