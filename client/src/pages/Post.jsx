import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { API_BASE } from "../config";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/posts/json/${id}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("unauthorized");
        return r.json();
      })
      .then((data) => {
        setPost(data.data);
      })
      .catch((err) => {
        if (err.message === "unauthorized") return navigate("/auth");
        console.error(err);
      });
  }, [id]);

  if (!post) return <p>Loading...</p>;

  const extractText = (p) => {
    if (!p) return "";
    if (p.content && p.content.blocks) {
      return p.content.blocks
        .map(
          (b) =>
            (b.data && (b.data.text || b.data.code || b.data.caption)) || ""
        )
        .join(" ")
        .replace(/<[^>]*>?/gm, "");
    }
    return p.body || "";
  };

  const estimatedMinutes = () => {
    const text = extractText(post);
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  };

  const renderContent = () => {
    if (post.content && post.content.blocks) {
      const html = post.content.blocks
        .map((b) => {
          switch (b.type) {
            case "header":
              return `<h${b.data.level} class="text-xl font-semibold text-white">${b.data.text}</h${b.data.level}>`;
            case "paragraph":
              return `<p class="text-lg text-gray-200 leading-relaxed">${b.data.text}</p>`;
            case "list":
              return `<ul class="list-disc pl-6 text-gray-200">${b.data.items
                .map((i) => `<li>${i}</li>`)
                .join("")}</ul>`;
            case "code":
              return `<pre class="bg-[#081226] p-3 rounded text-sm text-gray-200 overflow-auto"><code>${b.data.code}</code></pre>`;
            case "quote":
              return `<blockquote class="border-l-4 pl-4 italic text-gray-200">${b.data.text}</blockquote>`;
            case "embed":
              return b.data.embed ? b.data.embed : "";
            default:
              return "";
          }
        })
        .join("");

      const clean = DOMPurify.sanitize(html);
      return <div dangerouslySetInnerHTML={{ __html: clean }} />;
    }

    // If there's no Editor.js content, render the plain `body` while preserving
    // newlines as paragraphs/line breaks. Escape user text to avoid injecting HTML.
    const escapeHtml = (str = "") =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const formatted = (post.body || "")
      .split(/\n{2,}/)
      .map(
        (para) =>
          `<p class="text-lg text-gray-200 leading-relaxed">${escapeHtml(
            para
          ).replace(/\n/g, "<br />")}</p>`
      )
      .join("");

    const clean = DOMPurify.sanitize(formatted);
    return <div dangerouslySetInnerHTML={{ __html: clean }} />;
  };

  return (
    <main className="container py-10">
      <article className="card max-w-3xl mx-auto">
        <section className="text-center max-w-3xl mx-auto mt-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {post.title}
          </h1>
          <div className="flex justify-center items-center gap-3 text-gray-400 text-sm">
            <div
              className="author-avatar author-avatar-lg overflow-hidden"
              style={{
                background: post.user?.profileImage ? "transparent" : undefined,
              }}
            >
              {post.user?.profileImage ? (
                <img
                  src={post.user.profileImage}
                  alt={`${post.user?.username || "user"} avatar`}
                  className="avatar-img"
                  loading="lazy"
                />
              ) : (
                (post.user?.username || "?").slice(0, 1).toUpperCase()
              )}
            </div>
            <span className="text-gray-300 font-medium">
              {post.user?.username}
            </span>
            <span>•</span>
            <span>📅 {formatDate(post.createdAt)}</span>
            <span>•</span>
            <span>⏱ {estimatedMinutes()} min read</span>
          </div>
        </section>

        {/* <div className="prose prose-invert max-w-none mt-6">
          {renderContent()}
        </div> */}
        {/* <div className="max-w-3xl mx-auto mt-10 bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-md leading-relaxed space-y-6 text-gray-300">
          {renderContent()}
        </div> */}
        {/* <article className="max-w-3xl mx-auto mt-10 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-lg">
  <p className="text-gray-300 text-lg leading-relaxed italic text-center">
    {renderContent()}
    </p>
</article> */}
        <article className="max-w-3xl mx-auto px-6 py-12 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg mt-10">
          <div className="prose prose-invert prose-gray max-w-none text-lg leading-relaxed">
            {renderContent()}
          </div>
        </article>
      </article>
    </main>
  );
}
