import BlogForward from "@/components/blog-forward";
import { blogDestination } from "@/lib/forwarding";

export default function NotFound() {
  return <BlogForward target={blogDestination("en")} />;
}
