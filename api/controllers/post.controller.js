import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

//# function create post
export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Hanya admin yang dapat membuat post!"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Semua field harus diisi!"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {}
};

//# function show post on dashboard
export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 6;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [{ title: { $regex: req.query.searchTerm, $options: "i" } }, { content: { $regex: req.query.searchTerm, $options: "i" } }],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Ambil jumlah comment untuk setiap post
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return {
          ...post._doc,
          commentCount,
        };
      })
    );

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts: postsWithCommentCount,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

//# function delete post
export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Hanya admin yang dapat menghapus post!"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post berhasil dihapus!");
  } catch (error) {
    next(error);
  }
};

//# function update post
export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Hanya admin yang dapat mengupdate post!"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const incrementViews = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { views: 1 } }, // Menambah views dengan 1 setiap kali dipanggil
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};
