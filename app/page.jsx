"use client";
import { useState, useEffect, useRef } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  const fetchPosts = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts?page=${pageNum}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setTotal(data.total);
      setLimit(data.limit);
    } catch (err) {
      console.error("fetch posts failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && posts.length < total) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef.current, posts, total, loading, page]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Latest posts</h1>

      {posts.length ? (
        <>
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}

          {loading && <p className="mt-4">Loading...</p>}
          <div ref={loaderRef} className="h-10"></div>
        </>
      ) : (
        <p>No posts yet.</p>
      )}
    </section>
  );
}
