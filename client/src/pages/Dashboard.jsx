import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardProfile from "../components/DashboardProfile";
import DashboardPosts from "../components/DashboardPosts";
import DashboardUsers from "../components/DashboardUsers";
import DashboardComments from "../components/DashboardComments";
import DashboardOverview from "../components/DashboardOverview";
import DashboardCategory from "../components/DashboardCategory";
import DashboardProduct from "../components/DashboardProduct";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashboardSidebar />
      </div>
      {/* Profile */}
      {tab === "overview" && <DashboardOverview />}
      {/* Profile */}
      {tab === "profile" && <DashboardProfile />}
      {/* Posts */}
      {tab === "posts" && <DashboardPosts />}
      {/* Categories */}
      {tab === "category" && <DashboardCategory />}
      {/* users */}
      {tab === "users" && <DashboardUsers />}
      {/* Comments */}
      {tab === "comments" && <DashboardComments />}
      {/* Product */}
      {tab === "products" && <DashboardProduct />}
    </div>
  );
}
