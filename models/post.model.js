import mongoose, { Schema } from "mongoose";

const postSchema=new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
} , { timestamps: true })

export const Post = mongoose.model("Post",postSchema)
