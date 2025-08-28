
export default async function PostPage({ params }) {
  const slug = await params.slug;
  let post = null;
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/api/posts/${slug}`
    );
    if (res.ok) post = await res.json();
  } catch (err) {
    console.error(err);
  }

  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500">By {post.author?.name}</p>
      <div
        className="mt-6 prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
