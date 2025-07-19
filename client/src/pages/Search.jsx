import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Search() {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    if (query) {
      API.get(`/posts/search?q=${query}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error("Search failed", err));
    }
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">🔍 Search Results for: "{query}"</h1>
      {results.length > 0 ? (
        <ul className="grid gap-6">
          {results.map((post) => (
            <li key={post._id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
              <Link to={`/post/${post._id}`} className="text-blue-600 text-xl font-semibold hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
}
