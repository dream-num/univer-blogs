import { getPostsFromCache } from "@/lib/notion";
import PostCard from "@/components/post-card";

export default function Home() {
  const posts = getPostsFromCache('en');

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          Univer Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Univer is a full-stack framework for creating and editing spreadsheets, documents, and slides on both web and server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// Check main page.tsx
