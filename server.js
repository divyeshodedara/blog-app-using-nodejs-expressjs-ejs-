import express from "express"
import dotenv from "dotenv"
dotenv.config()
import expressEjsLayouts from "express-ejs-layouts"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import methodOverride from "method-override"
import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js"
import rateLimit from "express-rate-limit"


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

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride("_method"))
app.use(limiter);


app.use(express.static("public"))
app.use(expressEjsLayouts)
app.set("layout","./layouts/main")
app.set("view engine","ejs")

app.get("/",(req,res)=> res.redirect("/api/v1/auth/signup"))
app.use("/api/v1/posts",limiter,postRouter)
app.use("/api/v1/auth",limiter,authRouter)

app.listen(port ,()=>{
    console.log(`server is listening on port ${port}`);
})


