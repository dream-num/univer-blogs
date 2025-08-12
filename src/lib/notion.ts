import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/";
import fs from "fs";
import path from "path";
import 'dotenv/config';

// 注意：在 GitHub Pages 静态部署场景下，运行时不会调用 Notion API；
// fetchPublishedPosts 与 getPostFromNotion 仅在构建阶段 (scripts/cache-posts.ts) 使用。
export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({ notionClient: notion });

export interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  description: string;
  date: string;
  content: string;
  author?: string;
  tags?: string[];
  category?: string;
}

export async function getDatabaseStructure() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });
  return database;
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleanText ? cleanText.split(" ").length : 0;
}

export function getPostsFromCache(): Post[] {
  // 读取 public/posts-cache.json 以适配静态导出 (next export / GitHub Pages)
  const cachePath = path.join(process.cwd(), "public", "posts-cache.json");
  if (fs.existsSync(cachePath)) {
    try {
      const cache = fs.readFileSync(cachePath, "utf-8");
      return JSON.parse(cache);
    } catch (error) {
      console.error("Error reading posts cache:", error);
      return [];
    }
  }
  return [];
}

export async function fetchPublishedPosts() {
  // 仅在构建阶段脚本使用
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        { property: "Status", status: { equals: "Published" } },
      ],
    },
    sorts: [
      { property: "Published Date", direction: "descending" },
    ],
  });
  return posts.results as PageObjectResponse[];
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = getPostsFromCache();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getPostFromNotion(pageId: string): Promise<Post | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: pageId })) as PageObjectResponse;
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: contentString } = n2m.toMarkdownString(mdBlocks);

    const paragraphs = contentString.split("\n").filter((l: string) => l.trim().length > 0);
    const firstParagraph = paragraphs[0] || "";
    const description = firstParagraph.slice(0, 160) + (firstParagraph.length > 160 ? "..." : "");

    const properties = (page as any).properties;
    const post: Post = {
      id: page.id,
      title: properties.Title?.title?.[0]?.plain_text || "Untitled",
      slug: (properties.Title?.title?.[0]?.plain_text || "untitled")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      coverImage: properties["Featured Image"]?.url || undefined,
      description,
      date: properties["Published Date"]?.date?.start || new Date().toISOString(),
      content: contentString,
      author: properties.Author?.people?.[0]?.name,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      category: properties.Category?.select?.name,
    };
    return post;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}
