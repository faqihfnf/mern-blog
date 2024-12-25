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
              <Sidebar.Item className="text-cyan-950 font-semibold" active={tab === "overview"} icon={FaChartSimple} labelColor={currentUser.isAdmin ? "green" : "blue"} as="div">
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {/* profile */}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item className="text-cyan-950 font-semibold" active={tab === "profile"} icon={FaUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor={currentUser.isAdmin ? "green" : "blue"} as="div">
              Profile
            </Sidebar.Item>
          </Link>
          {/* posts */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item className="text-cyan-950 font-semibold" active={tab === "posts"} icon={HiDocumentText} as="div">
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {/* category */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=category">
              <Sidebar.Item className="text-cyan-950 font-semibold" active={tab === "category"} icon={BiSolidCategoryAlt} as="div">
                Categories
              </Sidebar.Item>
            </Link>
          )}

          {/* users */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item className="text-cyan-950 font-semibold" active={tab === "users"} icon={HiUserGroup} as="div">
                Users
              </Sidebar.Item>
            </Link>
          )}

          {/* comments */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item className="text-cyan-950 font-semibold" active={tab === "comments"} icon={IoMdChatbubbles} as="div">
                Comments
              </Sidebar.Item>
            </Link>
          )}

          {/* products */}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=products">
              <Sidebar.Item className="text-cyan-950 font-semibold" active={tab === "products"} icon={IoStorefront} as="div">
                Products
              </Sidebar.Item>
            </Link>
          )}

          {/* sign out */}
          <Sidebar.Item className="text-red-700 dark:text-red-700 font-semibold cursor-pointer" icon={FaSignOutAlt} onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
