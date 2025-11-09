import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  // json endpoints only
  jsonHome,
  jsonGetPost,
  jsonAddPost,
  jsonEditPost,
  jsonDeletePost,
  jsonMine,
  jsonSearch,
} from "../controllers/post.controller.js";

const postRouter = Router();

// URL : /api/v1/posts

// JSON endpoints for SPA (prefix: /json)
postRouter.get("/json", authMiddleware, jsonHome);
postRouter.get("/json/mine", authMiddleware, jsonMine);
postRouter.post("/json", authMiddleware, jsonAddPost);
postRouter.get("/json/:id", jsonGetPost);
postRouter.put("/json/:id", authMiddleware, jsonEditPost);
postRouter.delete("/json/:id", authMiddleware, jsonDeletePost);
postRouter.post("/json/search", jsonSearch);

export default postRouter;
