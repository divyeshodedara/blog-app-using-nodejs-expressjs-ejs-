import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/posts/${id}`).then((res) => {
      setTitle(res.data.title);
      setBody(res.data.body);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/posts/edit-post/${id}`, { title, body });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating post", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/delete-post/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">✏️ Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md shadow focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your post title"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border px-4 py-2 rounded-md shadow focus:ring-2 focus:ring-yellow-500"
          placeholder="Write your post content here..."
          rows={6}
        />
        <div className="flex gap-4">
          <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
            Update Post
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}