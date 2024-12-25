import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createcategory, getcategory, deletecategory, updatecategory } from "../controllers/category.controller.js";
const router = express.Router();

router.post("/createcategory", verifyToken, createcategory);
router.get("/getcategory", getcategory);
router.delete("/deletecategory/:categoryId", verifyToken, deletecategory);
router.put("/updatecategory/:categoryId", verifyToken, updatecategory);

export default router;
