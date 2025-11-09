import React, { useRef, useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const resetPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
  };

  const onPickFileClick = () => fileInputRef.current?.click();

  const onFileChange = (e) => {
    setUploadError("");
    const f = e.target.files?.[0];
    if (!f) {
      setImageFile(null);
      resetPreview();
      return;
    }
    const isImage = f.type.startsWith("image/");
    const isSmallEnough = f.size <= 2 * 1024 * 1024; // 2MB
    if (!isImage) {
      setUploadError("Please select an image file (JPEG, PNG, WebP).");
      setImageFile(null);
      resetPreview();
      return;
    }
    if (!isSmallEnough) {
      setUploadError("Image too large. Max size is 2MB.");
      setImageFile(null);
      resetPreview();
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeImage = () => {
    setImageFile(null);
    resetPreview();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp && uploadError) {
        throw new Error(uploadError);
      }
      let profileImageUrl = "";
      // If signing up and image selected, upload to Cloudinary first (unsigned preset expected)
      if (isSignUp && imageFile) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
        if (!cloudName || !unsignedPreset) {
          throw new Error(
            "Cloudinary config missing in .env (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UNSIGNED_PRESET)"
          );
        }
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", unsignedPreset);
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error?.message || "Image upload failed");
        }
        profileImageUrl = uploadData.secure_url;
      }

      const url = isSignUp
        ? `${API_BASE}/api/v1/auth/json/signup`
        : `${API_BASE}/api/v1/auth/json/signin`;
      const body = isSignUp
        ? JSON.stringify({ username, password, profileImage: profileImageUrl })
        : JSON.stringify({ username, password });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An error occurred");
        return;
      }
      // on sign in success redirect to posts
      if (!isSignUp) navigate("/posts");
      else setIsSignUp(false);
    } catch (err) {
      setError(err?.message || "Network error");
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-semibold mb-4 text-white">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full input-field text-lg text-gray-100"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full input-field text-lg text-gray-100"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSignUp && (
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="author-avatar author-avatar-lg avatar-ring overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Selected profile"
                      className="avatar-img"
                    />
                  ) : (
                    <span className="text-xs text-slate-200">No image</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <button
                    type="button"
                    className="btn-edit text-sm"
                    onClick={onPickFileClick}
                  >
                    Upload image
                  </button>
                  <button
                    type="button"
                    className="btn-delete text-sm disabled:opacity-50"
                    onClick={removeImage}
                    disabled={!preview}
                  >
                    Remove
                  </button>
                </div>
              </div>
              {uploadError ? (
                <p className="text-xs text-red-400">{uploadError}</p>
              ) : (
                <p className="text-xs text-slate-500">
                  JPEG/PNG/WebP up to 2MB.
                </p>
              )}
            </div>
          )}
          <button className="w-full btn-brand">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-sm muted underline"
            onClick={() => setIsSignUp((s) => !s)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </main>
  );
}
