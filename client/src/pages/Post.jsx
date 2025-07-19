import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState({ title: '', body: '' });

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => setPost(res.data.post || { title: '', body: '' }))
      .catch((err) => console.error("Error loading post", err));
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{post.title}</h1>
      <article className="prose prose-lg max-w-none text-gray-700">{post.body}</article>
    </div>
  );
}
