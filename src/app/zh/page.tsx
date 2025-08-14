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
          Univer 是一个前后端同构的全栈开发框架，可以在 web 端和服务端创建、编辑电子表格、文档以及幻灯片。
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