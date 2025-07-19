import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/posts/add-post", { title, body });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">📝 Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">Post Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded-md shadow focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your post title"
          />
        </div>
        <div>
          <label htmlFor="body" className="block font-semibold mb-1">Post Content</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={6}
            className="w-full border px-4 py-2 rounded-md shadow focus:ring-2 focus:ring-blue-500"
            placeholder="Write your post content here..."
          />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md">
          Publish Post
        </button>
      </form>
    </div>
  );
}
