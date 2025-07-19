import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig.js";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      const res = await API.get(`/posts?page=${page}`);
      setPosts(res.data.posts);
      setNextPage(res.data.hasNextPage ? res.data.nextPage : null);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome to BlogiFy 📝</h1>
        <p className="text-lg text-gray-600">Discover and share amazing stories from writers around the world.</p>
      </div>

      <div className="rounded-xl overflow-hidden mb-10 shadow-md">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="person looking out through window"
          className="w-full h-110 object-cover"
        />
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">📌 Latest Posts</h2>
        <ul className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <li key={post._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-5">
              <Link
                to={`/post/${post._id}`}
                className="block text-xl font-bold text-blue-600 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleDateString()} — By{" "}
                <span className="font-medium">{post.userInfo?.username || "Unknown"}</span>
              </p>
              <p className="text-gray-700 mt-2 line-clamp-2">{post.body.slice(0, 150)}...</p>
            </li>
          ))}
        </ul>

        {nextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchPosts(nextPage)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
            >
              View Older Posts
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
