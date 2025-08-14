import { getPostsFromCache, getWordCount } from "@/lib/notion";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { ResolvingMetadata } from "next";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/utils";
import { components } from "@/components/mdx-component";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface PostPageParams { slug: string; }
interface PostPageProps { params: Promise<PostPageParams>; }

export async function generateStaticParams() {
  const posts = getPostsFromCache('zh');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<PostPageParams> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const posts = getPostsFromCache('zh');
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "未找到文章" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${siteUrl}/zh/posts/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteUrl}/zh/posts/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : [],
      tags: post.tags,
      images: [{ url: post.coverImage || `${siteUrl}/opengraph-image.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage || `${siteUrl}/opengraph-image.png`, alt: post.title }],
    },
  };
}

export default async function ZhPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = getPostsFromCache('zh');
  const post = posts.find((p) => p.slug === slug);
  const wordCount = post?.content ? getWordCount(post.content) : 0;
  if (!post) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post!.title,
    description: post!.description,
    image: post!.coverImage || `${siteUrl}/opengraph-image.png`,
    datePublished: new Date(post!.date).toISOString(),
    author: { "@type": "Person", name: post!.author || "Guest Author" },
    publisher: { "@type": "Organization", name: "Your Site Name", logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/zh/posts/${post!.slug}` },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto prose dark:prose-invert">
        {post!.coverImage && (
          <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <Image src={post!.coverImage} alt={post!.title} fill className="object-cover" priority />
          </div>
        )}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <time>{format(new Date(post!.date), "yyyy年M月d日")}</time>
            {post!.author && <span>作者 {post!.author}</span>}
            <span>{calculateReadingTime(wordCount)}</span>
            <span>{wordCount} 字</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">{post!.title}</h1>
          <div className="flex gap-4 mb-4">
            {post!.category && (<Badge variant="secondary">{post!.category}</Badge>)}
            {post!.tags && post!.tags.map((tag) => (<Badge key={tag} variant="outline">{tag}</Badge>))}
          </div>
        </header>
        <div className="max-w-none">
          <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post!.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}