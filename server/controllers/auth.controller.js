import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JSON sign in - used by SPA
const jsonSignIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Username does not exist" });
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const crossOrigin = !!process.env.CLIENT_ORIGIN;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        crossOrigin && process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Sign in error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// JSON sign up - used by SPA
const jsonSignUp = async (req, res) => {
  try {
    const { username, password, profileImage } = req.body;
    if (!username | !password) {
      return res
        .status(400)
        .json({ error: "username and password both are required" });
    }

    const finduser = await User.findOne({ username });
    if (finduser) {
      return res.status(400).json({ error: "username already exists" });
    }
    const hashpass = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashpass,
      profileImage: profileImage || "",
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logOut = async (req, res) => {
  try {
    const crossOrigin = !!process.env.CLIENT_ORIGIN;
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        crossOrigin && process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    // if separate client, just 200 OK and let client route
    if (crossOrigin) return res.json({ success: true });
    // otherwise redirect to SPA auth page (same-origin)
    res.redirect("/auth");
  } catch (error) {
    console.log(error);
  }
};

// Return current user (requires auth middleware)
const getMe = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    const user = await User.findById(userId).select(
      "_id username createdAt profileImage"
    );
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// JSON logout for SPA
const jsonLogOut = async (req, res) => {
  try {
    const crossOrigin = !!process.env.CLIENT_ORIGIN;
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        crossOrigin && process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { logOut, jsonSignIn, jsonSignUp, getMe, jsonLogOut };
