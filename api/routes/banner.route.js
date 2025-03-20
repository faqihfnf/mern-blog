import express from "express";
import {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  getBannerById,
} from "../controllers/banner.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/createbanner", verifyToken, createBanner);
router.get("/getbanner", getBanner);
router.put("/updatebanner/:bannerId", verifyToken, updateBanner);
router.delete("/deletebanner/:bannerId", verifyToken, deleteBanner);
router.get("/getbanner/:bannerId", getBannerById);

export default router;
