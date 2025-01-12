import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getposts, deletepost, updatepost, incrementViews, getPopularPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.get("/getpopularposts", getPopularPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.post("/incrementViews/:postId", incrementViews);
export default router;
