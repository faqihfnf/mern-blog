import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import categoryRoute from "./routes/category.route.js";
import commentRoute from "./routes/comment.route.js";
import productRoute from "./routes/product.route.js";
import bannerRoute from "./routes/banner.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//# digunakan agar backend bisa menerima data/inputan dalam bentuk json
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(compression());

app.listen(3000, () => console.log("Server is running on port 3000"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/category", categoryRoute);
app.use("/api/comment", commentRoute);
app.use("/api/product", productRoute);
app.use("/api/banner", bannerRoute);

//# middleware untuk menangani error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
