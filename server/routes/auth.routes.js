import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  logOut,
  jsonSignIn,
  jsonSignUp,
  jsonLogOut,
  getMe,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// URL : /api/v1/auth

// Keep logout (clears cookie and redirects to SPA auth page)
authRouter.get("/logout", logOut);

// JSON endpoints used by SPA
authRouter.post("/json/signin", jsonSignIn);
authRouter.post("/json/signup", jsonSignUp);
authRouter.get("/me", authMiddleware, getMe);
// SPA logout (clears cookie)
authRouter.post("/json/logout", authMiddleware, (req, res) =>
  jsonLogOut(req, res)
);

export default authRouter;
