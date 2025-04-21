import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { Post } from "../models/post.model.js";
const adminLayout = "../views/layouts/admin";
import jwt from "jsonwebtoken";

const signIn = async (req, res) => {
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.redirect("/api/v1/posts");
  } catch (err) {
    console.error("Sign in error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username | !password) {
      res.send("username and password both are required");
    }

    const finduser = await User.findOne({username})
    if(finduser){
      res.send("username already exists")
    }
    const hashpass = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashpass,
    });
    res.redirect("/api/v1/auth/signin");
  } catch (error) {
    console.log(error);
  }
};

const getSignIn = async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Blog app",
    };
    res.render("layouts/signin", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
};

const getSignUp = (req, res) => {
  res.render("layouts/signup", {
    layout: adminLayout,
  });
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/api/v1/auth/signup");
  } catch (error) {
    console.log(error);
  }
};
export { signIn, signUp, getSignIn, getSignUp, logOut };
