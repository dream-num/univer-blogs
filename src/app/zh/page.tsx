import { getPostsFromCache } from "@/lib/notion";
import PostCard from "@/components/post-card";

export default function ZhHome() {
  const posts = getPostsFromCache('zh');
  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          Univer 博客
        </h1>
        <p className="text-lg text-muted-foreground">
          关于如何将分散数据转化为智能数据驱动决策的洞见与实践
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} locale="zh" />
        ))}
      </div>
    </div>
  );
}