import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const isValidUsername = (u) => {
  if (typeof u !== "string") return false;
  const trimmed = u.trim();
  return /^[A-Za-z0-9_.-]{3,30}$/.test(trimmed);
};

const isValidFullName = (n) => typeof n === "string" && n.trim().length >= 3 && n.trim().length <= 100;

const isValidPassword = (p) => typeof p === "string" && p.length >= 8;

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!isValidFullName(fullName) || !isValidUsername(username) || !isValidPassword(password)) {
      return res.status(400).json({ error: "Invalid input fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const sanitizedUsername = username.trim();
    const existing = await User.findOne({ username: sanitizedUsername }).lean().exec();
    if (existing) return res.status(400).json({ error: "Username already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(sanitizedUsername)}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${encodeURIComponent(sanitizedUsername)}`;

    const newUser = new User({
      fullName: fullName.trim(),
      username: sanitizedUsername,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    try {
      const csrfToken = req.csrfToken();
      res.cookie("XSRF-TOKEN", csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });
    } catch {}

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!isValidUsername(username) || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const sanitizedUsername = username.trim();
    const user = await User.findOne({ username: sanitizedUsername }).exec();

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    try {
      const csrfToken = req.csrfToken();
      res.cookie("XSRF-TOKEN", csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });
    } catch {}

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("XSRF-TOKEN", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
