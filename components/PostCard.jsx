import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="border rounded p-4 mb-4">
      <h2 className="text-xl font-semibold">
        <Link href={`/blog/${post._id}`}>{post.title}</Link>
      </h2>
      <p className="text-sm text-gray-500">
        By {post.author?.name || "Unknown"} •{" "}
        {new Date(post.createdAt)
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")}
      </p>
      <p className="mt-2">
        {post.excerpt || post.content?.slice(0, 200) + "..."}
      </p>
    </article>
  );
}
