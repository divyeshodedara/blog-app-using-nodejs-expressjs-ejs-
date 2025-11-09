import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          About BlogiFy
        </h1>
        <p className="text-gray-400 mb-6">
Blogify is a clean, modern platform to write and share blogs that matter.

Built with love using the MERN stack, it’s fast, minimal, and user-friendly.

Write freely. Read endlessly. Explore creativity — with Blogify.        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/posts" className="btn-brand">
            Read posts
          </Link>
          <Link to="/auth" className="btn-outline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
