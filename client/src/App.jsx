import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Product from "./pages/Product";
import Search from "./pages/Search";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";
import CreateBanner from "./pages/CreateBanner";
import UpdateBanner from "./pages/UpdateBanner";
import UpdateDraft from "./pages/UpdateDraft";

// Komponen wrapper untuk menambahkan Footer kondisional
function Layout() {
  const location = useLocation();
  const hideHeaderPaths = ["/sign-in", "/sign-up"];

  function shouldShowFooter(path) {
    const staticPaths = ["/", "/about", "/product"];
    if (staticPaths.includes(path)) return true;

    // Cek apakah path dimulai dengan "/post/"
    if (path.startsWith("/post/")) return true;

    // Cek apakah path dimulai dengan "/search"
    if (path.startsWith("/search")) return true;

    return false;
  }

  return (
    <>
      <ScrollToTop />
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        {/* Semua routes tetap sama */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product" element={<Product />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/update-draft/:draftId" element={<UpdateDraft />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route
            path="/update-product/:productId"
            element={<UpdateProduct />}
          />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route
            path="/update-product/:productId"
            element={<UpdateProduct />}
          />
          <Route path="/create-banner" element={<CreateBanner />} />
          <Route path="/update-banner/:bannerId" element={<UpdateBanner />} />
        </Route>
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      {shouldShowFooter(location.pathname) && <Footer />}
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
