"use client";
import ProtectedWrapper from "../../../components/ProtectedWrapper";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewPost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.");
      return;
    }

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/posts",
        { title, content },
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to create post. Please try again.");
    }
  }

  return (
    <ProtectedWrapper>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            className="border p-2 w-full h-48 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError("");
            }}
          />
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </ProtectedWrapper>
  );
}
