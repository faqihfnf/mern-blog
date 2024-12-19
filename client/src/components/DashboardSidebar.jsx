import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";

export default function DashboardSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
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
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              className="text-cyan-950 font-semibold"
              active={tab === "profile"}
              icon={FaUser}
              label={"User"}
              as="div">
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            className="text-red-700 dark:text-red-700 font-semibold cursor-pointer"
            icon={FaSignOutAlt}
            onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
