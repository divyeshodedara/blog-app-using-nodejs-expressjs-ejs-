import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const getAddPost = async (req, res) => {
  res.status(200).json({ message: "Ready to add post" });
};

const addPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const newpost = await Post.create({
      user: req.userId,
      title,
      body,
    });
    res.status(201).json({ message: "Post created", post: newpost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getPost = async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id });
    if (!data) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ post: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

const getEditPost = async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id });
    if (!data) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ post: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch post for editing" });
  }
};

const editPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });

    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user.toString() !== userId)
      return res.status(401).json({ error: "Unauthorized to edit this post" });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title: req.body.title, body: req.body.body },
      { new: true }
    );

    res.status(200).json({ message: "Post updated", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });

    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user.toString() !== userId)
      return res.status(401).json({ error: "Unauthorized to delete this post" });

    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// GET /posts/search?q=your-query
const searchPost = async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    console.log(req.query.q);
    
    const cleanedTerm = searchTerm.replace(/[^\w\s]/gi, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(cleanedTerm, "i") } },
        { body: { $regex: new RegExp(cleanedTerm, "i") } },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};


const homePage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: perPage * (page - 1) },
      { $limit: perPage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          title: 1,
          body: 1,
          createdAt: 1,
          "userInfo.username": 1,
        },
      },
    ]);

    const count = await Post.countDocuments();
    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.status(200).json({ posts: data, currentPage: page, hasNextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch home page posts" });
  }
};

const newPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const getDashBoard = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId });
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

const aboutPage = (req, res) => {
  res.status(200).json({ message: "This is the about page" });
};

export {
  getAddPost,
  addPost,
  getEditPost,
  editPost,
  deletePost,
  searchPost,
  getPost,
  homePage,
  getDashBoard,
  aboutPage,
  newPosts,
};