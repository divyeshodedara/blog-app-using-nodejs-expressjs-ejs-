import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  addPost,
  deletePost,
  editPost,
  getPost,
  homePage,
  searchPost,
  getDashBoard,
  aboutPage,
  newPosts
} from "../controllers/post.controller.js";

const postRouter = Router();

// URL : /api/v1/posts

//homepage 
postRouter.get("/",authMiddleware,newPosts);

//admin dashboard
postRouter.get("/dashboard", getDashBoard);

//search post
postRouter.post("/search",searchPost);

//add post
postRouter.post("/add-post", authMiddleware, addPost);

//about page
postRouter.get("/about",aboutPage)

//get perticular post
postRouter.get("/:id",getPost);

//edit post
postRouter.put("/edit-post/:id", authMiddleware, editPost);

//delete post
postRouter.delete("/delete-post/:id", authMiddleware, deletePost);


export default postRouter;
