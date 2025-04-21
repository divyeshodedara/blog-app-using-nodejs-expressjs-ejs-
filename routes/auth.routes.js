import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  getSignIn,
  getSignUp,
  logOut,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// URL : /api/v1/auth

authRouter.get("/signup", getSignUp);
authRouter.get("/signin", getSignIn);
authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.get("/logout", logOut);



export default authRouter;
