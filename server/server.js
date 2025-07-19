import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js"
import rateLimit from "express-rate-limit"
import cors from "cors"


const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, 
  max: 300, 
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, 
  legacyHeaders: false,
});



const app=express()

const port = process.env.PORT || 5000

connectDB()

app.use(cors(
  {
  origin: 'http://localhost:5173', // React dev server
  credentials: true
  }
))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(limiter);

app.get("/",(req,res)=> res.redirect("/api/v1/auth/signup"))
app.use("/api/v1/posts",limiter,postRouter)
app.use("/api/v1/auth",limiter,authRouter)

app.listen(port ,()=>{
    console.log(`server is listening on port ${port}`);
})


