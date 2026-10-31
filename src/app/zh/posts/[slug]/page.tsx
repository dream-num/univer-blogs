import BlogForward from "@/components/blog-forward";
import { blogDestination, retiredPosts } from "@/lib/forwarding";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return retiredPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  return { alternates: { canonical: blogDestination("zh", (await params).slug) } };
}

export default async function Post({ params }: Props) {
  return <BlogForward target={blogDestination("zh", (await params).slug)} chinese={true} />;
}
