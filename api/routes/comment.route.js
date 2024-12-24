import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createComment, getPostComments, likeComment, editComment, deleteComment, getComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomments/:postId", verifyToken, getPostComments);
router.put("/likecomment/:commentId/", verifyToken, likeComment);
router.put("/editcomment/:commentId/", verifyToken, editComment);
router.delete("/deletecomment/:commentId/", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getComment);

export default router;
