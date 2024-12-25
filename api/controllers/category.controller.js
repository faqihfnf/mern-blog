// controllers/category.controller.js

import Category from "../models/category.model.js";
import Post from "../models/post.model.js";

//# Create category
export const createcategory = async (req, res) => {
  try {
    const { name } = req.body;

    //! Ubah ke lowercase untuk konsistensi
    const lowerName = name.toLowerCase();

    const newCategory = new Category({
      name: lowerName,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Kategori sudah ada" });
    }
    res.status(500).json({ message: error.message });
  }
};

//# Get all categories with post count
export const getcategory = async (req, res) => {
  try {
    const categories = await Category.find().populate("postCount").sort({ createdAt: -1 });

    const formattedCategories = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      postCount: category.postCount || 0,
    }));

    res.status(200).json(formattedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//# Delete category
export const deletecategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // Update semua post yang menggunakan kategori ini menjadi 'uncategorized'
    await Post.updateMany({ category: category.name }, { category: "uncategorized" });

    await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//# Update category
export const updatecategory = async (req, res) => {
  try {
    const { name } = req.body;
    const lowerName = name.toLowerCase();

    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // Update nama kategori di collection Category
    const updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, { name: lowerName }, { new: true });

    // Update semua post yang menggunakan kategori lama
    await Post.updateMany({ category: category.name }, { category: lowerName });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
