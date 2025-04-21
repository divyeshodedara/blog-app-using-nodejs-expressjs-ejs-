import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const adminLayout = "../views/layouts/admin";

const getAddPost = async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Blog app",
    };
    res.render("admin/add-post", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
};

const addPost = async (req, res) => {
  try {
    const { title, body } = req.body;

    const newpost = await Post.create({
      user: req.userId,
      title,
      body,
    });

    res.redirect("/api/v1/posts/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id });
    // const data = await Post.findOne();
    const locals = {
      title: data.title,
      description: `Blog : ${data.title}`,
    };
    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
};

const getEditPost = async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Blog app",
    };
    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      data,
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
};

const editPost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
    });

    res.redirect("/api/v1/posts/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {

    const userId=req.userId
    const postId=req.params.id

    const post=await Post.findOne({_id: postId})

    if(post.user==userId){
      await Post.deleteOne({ _id: req.params.id });
    }else{
      return res.status(401).json({ error : "you are not authorized to delete post of other peoples, so mind your own business"})
    }
    res.redirect("/api/v1/posts/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const searchPost = async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Search Bar",
    };

    const searchTerm = req.body.searchTerm || "";
    
    // Remove only special characters (keep letters, numbers, and spaces)
    const cleanedTerm = searchTerm.replace(/[^\w\s]/gi, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(cleanedTerm, "i") } },
        { body: { $regex: new RegExp(cleanedTerm, "i") } },
      ],
    });

    res.render("search", { locals, data });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};


const homePage = async (req, res) => {
  const userId= req.userId

    const user = await User.findById(userId)

    if(!user){
      res.status(401).json({error : "user not found"})
    }

  const locals = {
    title: "blog app",
    description: "blogging app for users",
    name : user.username
    
  };
  
  try {

    
    const perpage = 10;
    const page = parseInt(req.query.page) || 1;


    const data = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: perpage * (page - 1) },
      { $limit: perpage },
      {
        $lookup: {
          from: "users", // MongoDB collection name
          localField: "user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          title: 1,
          body: 1,
          createdAt: 1,
          "userInfo.username": 1
        }
      }
    ]);
    
   
  
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perpage);
  
    res.render("index", {
      locals,
      data,
      current: page,
      hasNextPage, 
      nextPage,
      username : user.username,
    });
  } catch (error) {
    console.log(error);
  }
};

const getDashBoard = async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Blog app",
    };
   

    const data = await Post.find({ user: req.userId });
    res.render("dashboard", { data, locals });
  } catch (error) {
    console.log(error);
  }
};


const aboutPage = (req,res)=>{
  res.render("about")
}

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
  aboutPage
};
