import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts")
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error("Error fetching dashboard posts", err));
  }, []);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/delete-post/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Posts</h2>
        <Link to="/add-post" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          + Add New
        </Link>
      </div>

      <ul className="grid gap-6">
        {posts.map((post) => (
          <li key={post._id} className="bg-white shadow rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/post/${post._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                  {post.title}
                </Link>
                <p className="text-gray-500 text-sm mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deletePost(post._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
