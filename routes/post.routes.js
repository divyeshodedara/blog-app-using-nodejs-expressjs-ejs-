import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  addPost,
  deletePost,
  editPost,
  getAddPost,
  getEditPost,
  getPost,
  homePage,
  searchPost,
  getDashBoard,
  aboutPage
} from "../controllers/post.controller.js";

const postRouter = Router();

// URL : /api/v1/posts

//homepage 
postRouter.get("/",authMiddleware,homePage);

//admin dashboard
postRouter.get("/dashboard",authMiddleware, getDashBoard);

//search post
postRouter.post("/search",searchPost);

//get add post page
postRouter.get("/add-post", getAddPost);

//add post
postRouter.post("/add-post", authMiddleware, addPost);

//about page
postRouter.get("/about",aboutPage)

//get perticular post
postRouter.get("/:id",getPost);

//get edit post page
postRouter.get("/page/edit-post/:id", authMiddleware, getEditPost);

//edit post
postRouter.put("/edit-post/:id", authMiddleware, editPost);

//delete post
postRouter.delete("/delete-post/:id", authMiddleware, deletePost);


export default postRouter;
