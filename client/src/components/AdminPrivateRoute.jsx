import { useSelector } from "react-redux";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;
}
