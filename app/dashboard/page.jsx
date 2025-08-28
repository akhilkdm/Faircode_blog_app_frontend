"use client";
import ProtectedWrapper from "../../components/ProtectedWrapper";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const role = session?.user?.role;

  useEffect(() => {
    if (!session) return;
    loadPosts();
  }, [session]);

  async function loadPosts() {
    setLoading(true);
    try {
      const endpoint = role === "admin" ? "/api/posts" : "/api/posts/my-posts";
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + endpoint,
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      setPosts(res.data.posts);
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await axios.delete(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/api/posts/${deleteId}`,
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      setPosts(posts.filter((p) => p._id !== deleteId));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <ProtectedWrapper>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {role === "admin" ? "All Posts" : "My Posts"}
          </h1>
          <Link
            href="/dashboard/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Post
          </Link>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length ? (
          <div className="space-y-4">
            {posts.map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).replace(",", "")}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <Link
                      href={`/blog/${p._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/blog/${p._id}/edit`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No posts found.</p>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedWrapper>
  );
}
