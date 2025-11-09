import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMine = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/v1/posts/json/mine`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("unauthorized");
        return r.json();
      })
      .then((data) => setPosts(data.data || []))
      .catch((err) => {
        if (err.message === "unauthorized") return navigate("/auth");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`${API_BASE}/api/v1/posts/json/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchMine();
  };

  return (
    <main className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-white">My Blogs</h1>
        <Link to="/add-post" className="btn-brand text-sm">
          + Add New
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (
        <ul className="grid gap-4">
          {posts.map((p) => (
            <li key={p._id} className="card flex justify-between items-center">
              <div>
                <Link
                  to={`/posts/${p._id}`}
                  className="text-2xl text-white font-medium"
                >
                  {p.title}
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={`/edit-post/${p._id}`}
                  className="btn-edit text-sm"
                  aria-label={`Edit post titled ${p.title}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(p._id)}
                  className="btn-delete text-sm"
                  aria-label={`Delete post titled ${p.title}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
