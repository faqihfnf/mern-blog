import express from "express";
import { createProduct, getProduct, updateProduct, deleteProduct, getProductById } from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/createproduct", verifyToken, createProduct);
router.get("/getproduct", getProduct);
router.put("/updateproduct/:productId", verifyToken, updateProduct);
router.delete("/deleteproduct/:productId", verifyToken, deleteProduct);
router.get("/getproduct/:productId", getProductById);

export default router;
