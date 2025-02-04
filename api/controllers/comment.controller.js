import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

// # function create comment
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "Kamu tidak memiliki akses untuk membuat komentar!"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

// # function get comment
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

//# function like comment
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan!"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// # function edit comment
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan!"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "Kamu tidak memiliki akses untuk mengedit komentar!"));
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

// # function delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan!"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "Kamu tidak memiliki akses untuk menghapus komentar!"));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Komentar berhasil dihapus!");
  } catch (error) {
    next(error);
  }
};

// # function get comment to dahsboard
export const getComment = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Kamu tidak memiliki akses untuk mengakses data komentar!"));
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 6;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const totalComments = await Comment.countDocuments();
    // Populate postId untuk mendapatkan slug
    const comments = await Comment.find()
      .populate("postId", "slug title") // tambahkan ini untuk mendapatkan slug dan title post
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const now = new Date();

    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
