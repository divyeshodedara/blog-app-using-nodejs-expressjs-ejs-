import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 300,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

const port = process.env.PORT || 5000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(limiter);

// CORS for separate client deployment
// Set CLIENT_ORIGIN to your Render static site URL, e.g. https://your-client.onrender.com
const clientOrigin = process.env.CLIENT_ORIGIN || undefined; // undefined lets cors reflect origin when using credentials if origin matches
app.use(
  cors({
    origin: clientOrigin || true,
    credentials: true,
  })
);

app.use(express.static("public"));

// Root should serve client or redirect to SPA auth/home. Redirecting to SPA root.
app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/v1/posts", limiter, postRouter);
app.use("/api/v1/auth", limiter, authRouter);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
