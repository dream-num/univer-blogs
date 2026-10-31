import BlogForward from "@/components/blog-forward";
import { blogDestination } from "@/lib/forwarding";

const target = blogDestination("zh");
export const metadata = { alternates: { canonical: target } };

export default function Home() {
  return <BlogForward target={target} chinese={true} />;
}
