import { Router } from "express";
import {  
  logOut,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// URL : /api/v1/auth

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.get("/logout", logOut);



export default authRouter;
