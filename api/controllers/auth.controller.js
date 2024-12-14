import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  //# pengecekan apakah ada field yang kosong saat user signup
  if (!username || !email || !password || username === "" || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  //# kalau user berhasil signup, data user akan masuk ke database
  try {
    await newUser.save();
    res.json({ message: "Signup successfully" });
  } catch (error) {
    next(error);
  }
};
