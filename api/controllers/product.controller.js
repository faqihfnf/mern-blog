import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

//# Create new product
export const createProduct = async (req, res, next) => {
  try {
    const { image, name, price, link } = req.body;

    if (!name || !price || !link) {
      return next(errorHandler(400, "All fields are required"));
    }

    const newProduct = new Product({
      image,
      name,
      price,
      link,
      //   userId: req.user.id, // dari verifyToken middleware
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

//# Get all products
export const getProduct = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (startIndex - 1) * limit;

    const totalProducts = await Product.countDocuments();

    // Mengambil produk sesuai dengan paginasi
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Mengurutkan dari yang terbaru
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      totalProducts,
      startIndex,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          image: req.body.image,
          name: req.body.name,
          price: req.body.price,
          link: req.body.link,
        },
      },
      { new: true } // Mengembalikan data setelah diperbarui
    );

    if (!updatedProduct) {
      return next(errorHandler(404, "Product not found"));
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }

    // if (product.userId !== req.user.id) {
    //   return next(errorHandler(403, "You can only delete your own products"));
    // }

    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json("Product has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
