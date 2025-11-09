// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasNext, setHasNext] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const search = params.get("search");
//     const p = parseInt(params.get("page")) || page;
//     setPage(p);

//     setLoading(true);
//     if (search) {
//       // search via JSON endpoint
//       fetch(`/api/v1/posts/json/search`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ searchTerm: search }),
//       })
//         .then((r) => {
//           if (r.status === 401) throw new Error("unauthorized");
//           return r.json();
//         })
//         .then((data) => {
//           setPosts(data.data || []);
//           setHasNext(false);
//         })
//         .catch((err) => {
//           if (err.message === "unauthorized") return navigate("/auth");
//           console.error(err);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       fetch(`/api/v1/posts/json?page=${p}`, { credentials: "include" })
//         .then((r) => {
//           if (r.status === 401) throw new Error("unauthorized");
//           return r.json();
//         })
//         .then((data) => {
//           setPosts(data.data || []);
//           setHasNext(data.hasNextPage);
//               import React, { useEffect, useState } from "react";
//               import { Link, useLocation, useNavigate } from "react-router-dom";

//               // Clean reconstruction of Home component with avatar image support
//               export default function Home() {
//                 const [posts, setPosts] = useState([]);
//                 const [page, setPage] = useState(1);
//                 const [hasNext, setHasNext] = useState(false);
//                 const [loading, setLoading] = useState(false);
//                 const location = useLocation();
//                 const navigate = useNavigate();

//                 useEffect(() => {
//                   const params = new URLSearchParams(location.search);
//                   const search = params.get("search");
//                   const p = parseInt(params.get("page")) || 1;
//                   setPage(p);
//                   setLoading(true);
//                   const handleError = (err) => {
//                     if (err.message === "unauthorized") return navigate("/auth");
//                     console.error(err);
//                   };
//                   if (search) {
//                     fetch(`/api/v1/posts/json/search`, {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       credentials: "include",
//                       body: JSON.stringify({ searchTerm: search }),
//                     })
//                       .then((r) => {
//                         if (r.status === 401) throw new Error("unauthorized");
//                         return r.json();
//                       })
//                       .then((data) => {
//                         setPosts(data.data || []);
//                         setHasNext(false);
//                       })
//                       .catch(handleError)
//                       .finally(() => setLoading(false));
//                   } else {
//                     fetch(`/api/v1/posts/json?page=${p}`, { credentials: "include" })
//                       .then((r) => {
//                         if (r.status === 401) throw new Error("unauthorized");
//                         return r.json();
//                       })
//                       .then((data) => {
//                         setPosts(data.data || []);
//                         setHasNext(data.hasNextPage);
//                       })
//                       .catch(handleError)
//                       .finally(() => setLoading(false));
//                   }
//                 }, [location.search]);

//                 const formatDate = (dateStr) => {
//                   if (!dateStr) return "";
//                   const d = new Date(dateStr);
//                   const dd = String(d.getDate()).padStart(2, "0");
//                   const mm = String(d.getMonth() + 1).padStart(2, "0");
//                   const yyyy = d.getFullYear();
//                   return `${dd}/${mm}/${yyyy}`;
//                 };

//                 return (
//                   <main className="container py-8">
//                     <div className="flex items-center justify-between mb-6">
//                       <h1 className="text-4xl font-semibold text-white">Latest Posts</h1>
//                     </div>
//                     {loading && <p>Loading...</p>}
//                     {!loading && (
//                       <div>
//                         {posts.length === 0 && (
//                           <p className="text-sm text-gray-600">No posts to show.</p>
//                         )}
//                         <ul className="grid gap-6 grid-cols-1">
//                           {posts.map((post, index) => {
//                             const variantClass =
//                               index === 0
//                                 ? "card-grad-a"
//                                 : index % 3 === 1
//                                 ? "card-grad-b"
//                                 : "card-grad-c";
//                             const username =
//                               post.userInfo?.username || post.user?.username || "Unknown";
//                             const avatar =
//                               post.userInfo?.profileImage || post.user?.profileImage || "";
//                             const formattedDate = formatDate(post.createdAt);
//                             return (
//                               <li
//                                 key={post._id}
//                                 className={`card flex flex-col group ${variantClass}`}
//                               >
//                                 <div className="flex items-center gap-4 mb-4">
//                                   <div
//                                     className="author-avatar overflow-hidden flex-shrink-0"
//                                     style={{
//                                       background: avatar
//                                         ? "transparent"
//                                         : `linear-gradient(${135 + ((index * 47) % 360)}deg, #0ea5e9, #2563eb)`,
//                                     }}
//                                   >
//                                     {avatar ? (
//                                       <img
//                                         src={avatar}
//                                         alt={`${username} avatar`}
//                                         className="w-full h-full object-cover avatar-img"
//                                         loading="lazy"
//                                       />
//                                     ) : (
//                                       username.slice(0, 1).toUpperCase()
//                                     )}
//                                   </div>
//                                   <div className="flex-1 min-w-0">
//                                     <Link
//                                       to={`/posts/${post._id}`}
//                                       className={`title ${
//                                         index === 0 ? "text-gradient" : "text-white"
//                                       } hover:text-brand transition-colors block`}
//                                     >
//                                       {post.title}
//                                     </Link>
//                                     <div className="text-sm author-muted mt-1">
//                                       By {username} {formattedDate && <>• {formattedDate}</>}
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <p className="text-gray-300 text-base leading-relaxed excerpt mb-4">
//                                   {post.body || ""}
//                                 </p>
//                                 <Link
//                                   to={`/posts/${post._id}`}
//                                   className={`btn-brand px-3 py-2 text-sm font-medium inline-flex items-center gap-1 shadow-sm self-start whitespace-nowrap`}
//                                   style={{ boxShadow: "0 4px 14px rgba(14,165,233,0.25)" }}
//                                   aria-label={`Read ${
//                                     index === 0 ? "featured " : ""
//                                   }article titled ${post.title}`}
//                                 >
//                                   {"Read article"}
//                                 </Link>
//                               </li>
//                             );
//                           })}
//                         </ul>
//                         {(hasNext || page > 1) && (
//                           <div className="mt-6 text-center flex items-center justify-center gap-4">
//                             {page > 1 && (
//                               <Link
//                                 to={`/posts?page=${page - 1}`}
//                                 className="btn-outline text-sm"
//                               >
//                                 Newer posts
//                               </Link>
//                             )}
//                             {hasNext && (
//                               <Link
//                                 to={`/posts?page=${page + 1}`}
//                                 className="btn-outline text-sm"
//                               >
//                                 Older posts
//                               </Link>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </main>
//                 );
//               }

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const p = parseInt(params.get("page")) || 1;
    setPage(p);
    setLoading(true);

    const handleError = (err) => {
      if (err.message === "unauthorized") return navigate("/auth");
      console.error(err);
    };

    const request = search
      ? fetch(`${API_BASE}/api/v1/posts/json/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ searchTerm: search }),
        })
      : fetch(`${API_BASE}/api/v1/posts/json?page=${p}`, {
          credentials: "include",
        });

    request
      .then((r) => {
        if (r.status === 401) throw new Error("unauthorized");
        return r.json();
      })
      .then((data) => {
        setPosts(data.data || []);
        setHasNext(search ? false : data.hasNextPage);
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [location.search, navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <main className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-semibold text-white">Latest Posts</h1>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          {posts.length === 0 && (
            <p className="text-sm text-gray-600">No posts to show.</p>
          )}

          <ul className="grid gap-6 grid-cols-1">
            {posts.map((post, index) => {
              const variantClass =
                index === 0
                  ? "card-grad-a"
                  : index % 3 === 1
                  ? "card-grad-b"
                  : "card-grad-c";
              const username =
                post.userInfo?.username || post.user?.username || "Unknown";
              const avatar =
                post.userInfo?.profileImage || post.user?.profileImage || "";
              const formattedDate = formatDate(post.createdAt);

              return (
                <li
                  key={post._id}
                  className={`card flex flex-col group ${variantClass}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="author-avatar overflow-hidden flex-shrink-0"
                      style={{
                        background: avatar
                          ? "transparent"
                          : `linear-gradient(${
                              135 + ((index * 47) % 360)
                            }deg, #0ea5e9, #2563eb)`,
                      }}
                    >
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={`${username} avatar`}
                          className="avatar-img"
                          loading="lazy"
                        />
                      ) : (
                        username.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/posts/${post._id}`}
                        className={`title ${
                          index === 0 ? "text-gradient" : "text-white"
                        } hover:text-brand transition-colors block`}
                      >
                        {post.title}
                      </Link>
                      <div className="text-sm author-muted mt-1">
                        By {username} {formattedDate && <>• {formattedDate}</>}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed excerpt mb-4">
                    {post.body || ""}
                  </p>
                  <Link
                    to={`/posts/${post._id}`}
                    className="btn-brand px-3 py-2 text-sm font-medium inline-flex items-center gap-1 shadow-sm self-start whitespace-nowrap"
                    style={{ boxShadow: "0 4px 14px rgba(14,165,233,0.25)" }}
                    aria-label={`Read ${
                      index === 0 ? "featured " : ""
                    }article titled ${post.title}`}
                  >
                    Read Blog
                  </Link>
                </li>
              );
            })}
          </ul>

          {(hasNext || page > 1) && (
            <div className="mt-6 text-center flex items-center justify-center gap-4">
              {page > 1 && (
                <Link
                  to={`/posts?page=${page - 1}`}
                  className="btn-outline text-sm"
                >
                  Newer posts
                </Link>
              )}
              {hasNext && (
                <Link
                  to={`/posts?page=${page + 1}`}
                  className="btn-outline text-sm"
                >
                  Older posts
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
