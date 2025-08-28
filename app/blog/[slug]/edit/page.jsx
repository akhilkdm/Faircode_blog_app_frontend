"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditPost() {
  const router = useRouter();
  const { slug } = useParams();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${slug}`
        );
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
        } else {
          setError("Failed to load post data.");
        }
      } catch {
        setError("Something went wrong while fetching the post.");
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Failed to update post.");
      }
    } catch {
      setError("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(""); 
          }}
          placeholder="Enter title"
        />
        <textarea
          className="w-full border p-2 rounded h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError("");
          }}
          placeholder="Write your content..."
        />
        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </section>
  );
}
