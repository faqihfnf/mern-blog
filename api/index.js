import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";

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

app.listen(3000, () => console.log("Server is running on port 3000"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
