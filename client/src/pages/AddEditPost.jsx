import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

export default function AddEditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const editorHolderId = "editorjs";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/v1/posts/json/${id}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("unauthorized");
        return r.json();
      })
      .then((data) => {
        const p = data.data;
        setTitle(p.title || "");
        setBody(p.body || "");
        // initialize editor with existing content if available
        // wait for editor to be ready and only render into an empty editor
        if (p.content && editorRef.current) {
          editorRef.current.isReady
            .then(() => {
              try {
                const blocksCount =
                  (editorRef.current.blocks &&
                    editorRef.current.blocks.getBlocksCount &&
                    editorRef.current.blocks.getBlocksCount()) ||
                  0;
                // render only if editor is currently empty to avoid duplicate blocks/placeholder
                if (blocksCount === 0 && editorRef.current.render) {
                  editorRef.current.render(p.content);
                }
              } catch (e) {
                // if blocks API not available for some reason, attempt a single render
                editorRef.current.render && editorRef.current.render(p.content);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // init EditorJS
    // init EditorJS (guard so we don't initialize twice in StrictMode)
    if (editorRef.current) return;

    const editor = new EditorJS({
      holder: editorHolderId,
      autofocus: true,
      placeholder: "Write your post...",
      inlineToolbar: true,
      tools: {
        header: Header,
        list: List,
        code: CodeTool,
        embed: Embed,
        marker: Marker,
        inlineCode: InlineCode,
      },
    });

    editorRef.current = editor;
    // if editor successfully initialized, don't show fallback textarea
    setShowFallback(false);

    return () => {
      if (editorRef.current) {
        // ensure proper destroy and clear the ref so re-mount can initialize cleanly
        editorRef.current.isReady
          .then(() => editorRef.current.destroy())
          .catch(() => {})
          .finally(() => {
            editorRef.current = null;
          });
      }
    };
  }, []);

  // If EditorJS fails to initialize (or is slow), show a fallback textarea after a short delay
  useEffect(() => {
    const t = setTimeout(() => {
      if (!editorRef.current) setShowFallback(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    // collect editor content
    let content = null;
    try {
      if (editorRef.current) {
        content = await editorRef.current.save();
      }
    } catch (err) {
      console.error("Error saving editor content", err);
      alert("Please fix editor content before saving.");
      return;
    }

    const url = id
      ? `${API_BASE}/api/v1/posts/json/${id}`
      : `${API_BASE}/api/v1/posts/json`;
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content, body }),
    });
    if (res.ok) navigate("/dashboard");
    else {
      const data = await res.json();
      alert(data.error || "An error occurred");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="container py-8">
      <div className="card max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4 text-white">
          {id ? "Edit Post" : "Add Post"}
        </h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-base muted">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full input-field text-2xl font-semibold text-gray-100 py-3"
              required
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block mb-1 text-base muted">Content</label>
            {showFallback ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full input-field text-lg text-gray-100"
                placeholder="Write your post..."
              />
            ) : (
              <div id={editorHolderId} className="editor-holder shadow-sm" />
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-brand">
              {id ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
