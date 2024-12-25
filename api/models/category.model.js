// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual untuk menghitung jumlah post per kategori
categorySchema.virtual("postCount", {
  ref: "Post",
  localField: "name", // menggunakan name dari Category
  foreignField: "category", // menggunakan category dari Post
  count: true, // hanya menghitung jumlah
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
