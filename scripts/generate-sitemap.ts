import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { retiredPosts } from "../src/lib/forwarding";

// Keep the old URLs discoverable so crawlers can reach their forwarding pages.
const siteUrl = "https://blog.univer.ai";
const items = [
  "/",
  "/zh/",
  ...retiredPosts.flatMap(({ slug }) => [`/posts/${slug}/`, `/zh/posts/${slug}/`]),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).join("\n")}\n</urlset>`;
writeFileSync(join(process.cwd(), "public", "sitemap.xml"), sitemap);
