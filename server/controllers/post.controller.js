import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

// JSON endpoints for SPA
const jsonHome = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: "user not found" });

    const perpage = 10;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: perpage * (page - 1) },
      { $limit: perpage },
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
          _id: 1,
          title: 1,
          body: 1,
          createdAt: 1,
          "userInfo.username": 1,
          "userInfo.profileImage": 1,
        },
      },
    ]);

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perpage);

    res.json({
      locals: {
        title: "blog app",
        description: "blogging app for users",
        name: user.username,
      },
      data,
      current: page,
      hasNextPage,
      nextPage,
      username: user.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const jsonGetPost = async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id }).populate(
      "user",
      "username profileImage"
    );
    if (!data) return res.status(404).json({ error: "Post not found" });
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// helper: extract a short text snippet from Editor.js content
const extractTextFromContent = (content) => {
  if (!content || !content.blocks) return "";
  const parts = content.blocks.map((b) => {
    const t =
      (b.data &&
        (b.data.text ||
          b.data.items ||
          b.data.code ||
          b.data.caption ||
          b.data.html)) ||
      "";
    if (Array.isArray(t)) return t.join(" ");
    return t;
  });
  return parts
    .join(" ")
    .replace(/<[^>]*>?/gm, "")
    .slice(0, 800);
};

const jsonAddPost = async (req, res) => {
  try {
    const { title, body, content } = req.body;
    // basic validation
    if (!title || title.toString().trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }
    // If Editor.js content provided, generate a body snippet from it
    let finalBody = body || "";
    if (content) {
      const snippet = extractTextFromContent(content);
      if (snippet && snippet.length > 0) finalBody = snippet;
    }

    const newpost = await Post.create({
      user: req.userId,
      title,
      body: finalBody,
      content: content || null,
    });
    res.status(201).json({ success: true, post: newpost });
  } catch (error) {
    console.error("jsonAddPost error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

const jsonEditPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user == userId) {
      const { title, body, content } = req.body;
      let finalBody = body || post.body || "";
      if (content) {
        const snippet = extractTextFromContent(content);
        if (snippet && snippet.length > 0) finalBody = snippet;
      }
      await Post.findByIdAndUpdate(postId, {
        title: title,
        body: finalBody,
        content: content || post.content,
      });
      res.json({ success: true });
    } else {
      return res
        .status(401)
        .json({ error: "you are not authorized to edit this post" });
    }
  } catch (error) {
    console.error("jsonEditPost error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

const jsonDeletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user == userId) {
      await Post.deleteOne({ _id: postId });
      res.json({ success: true });
    } else {
      return res
        .status(401)
        .json({ error: "you are not authorized to delete this post" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const jsonMine = async (req, res) => {
  try {
    const data = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const jsonSearch = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm || "";
    const cleanedTerm = searchTerm.replace(/[^\w\s]/gi, "");
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(cleanedTerm, "i") } },
        { body: { $regex: new RegExp(cleanedTerm, "i") } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profileImage");
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  // JSON endpoints
  jsonHome,
  jsonGetPost,
  jsonAddPost,
  jsonEditPost,
  jsonDeletePost,
  jsonMine,
  jsonSearch,
};
