import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

//# function create post
export const create = async (req, res, next) => {
  try {
    // Validasi admin
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Hanya admin yang dapat membuat post!"));
    }

    // Validasi title dan content (opsional untuk draft)
    if (!req.body.title) {
      return next(errorHandler(400, "Title harus diisi!"));
    }

    // Buat slug, bahkan untuk draft
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-z0-9-]/g, "");

    // Pastikan slug unik
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      // Tambahkan timestamp atau random string jika slug sudah ada
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content || "", // Boleh kosong untuk draft
      userId: req.user.id,
      slug,
      tags: req.body.tags || "",
      category: req.body.category || "uncategorized",
      image: req.body.image || "/blog-post.png",
      isDraft: req.body.isDraft !== undefined ? req.body.isDraft : true,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error); // Log error untuk debugging
    next(errorHandler(500, "Gagal membuat post: " + error.message));
  }
};
//# function show post on dashboard
export const getposts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
      // Tambahkan filter draft berdasarkan parameter
      ...(req.query.draft !== undefined
        ? { isDraft: req.query.draft === "true" }
        : { isDraft: false }), // Default hanya tampilkan yang publish
    };

    const posts = await Post.find(query)
      .sort({ createdAt: sortDirection, _id: 1 })
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

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...query,
    });

    res.status(200).json({
      posts: postsWithCommentCount,
      totalPosts,
      lastMonthPosts,
      totalPages,
      currentPage: page,
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
          tags: req.body.tags,
          isDraft: req.body.isDraft !== undefined ? req.body.isDraft : true,
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

//# function get popular posts
export const getPopularPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find({ isDraft: false })
      .sort({ views: -1 }) // Urutkan berdasarkan views terbanyak
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

    res.status(200).json({
      posts: postsWithCommentCount,
    });
  } catch (error) {
    next(error);
  }
};
