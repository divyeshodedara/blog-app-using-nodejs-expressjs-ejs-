import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    // Editor.js content stored as JSON (blocks). Keep as Mixed for flexibility.
    content: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
