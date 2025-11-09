import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/posts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/json/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/auth");
      } else {
        window.location.href = `${API_BASE}/api/v1/auth/logout`;
      }
    } catch (err) {
      window.location.href = `${API_BASE}/api/v1/auth/logout`;
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md"
      style={{ background: "rgba(6,8,15,0.45)" }}
    >
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link
            to="/posts"
            className="text-2xl sm:text-3xl font-semibold text-white"
          >
            BlogiFy
          </Link>
          <form
            onSubmit={onSearch}
            className="hidden sm:block"
            role="search"
            aria-label="Site search"
          >
            <div className="search-wrapper">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                name="searchTerm"
                placeholder="Search"
                className="search-input pr-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <Link
            to="/posts"
            className={`nav-pill ${isActive("/posts") ? "nav-cta" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`nav-pill ${isActive("/dashboard") ? "nav-cta" : ""}`}
          >
            My Blogs
          </Link>
          <Link
            to="/about"
            className={`nav-pill ${isActive("/about") ? "nav-cta" : ""}`}
          >
            About
          </Link>
          <button
            onClick={handleLogout}
            className="nav-pill"
            aria-label="Log out"
          >
            Log out
          </button>
        </nav>

        {/* mobile menu button */}
        <div className="sm:hidden">
          <button
            onClick={() => setOpen((s) => !s)}
            className="input-field px-3 py-2"
            aria-label="Menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {/* mobile menu drawer */}
      {open && (
        <div className="sm:hidden border-t border-white/4">
          <div className="container py-3 flex flex-col gap-2">
            <Link
              to="/posts"
              onClick={() => setOpen(false)}
              className="nav-pill"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="nav-pill"
            >
              My Blogs
            </Link>
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="nav-pill"
            >
              About
            </Link>
            <button
              onClick={handleLogout}
              className="nav-pill mt-1"
              aria-label="Log out"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
