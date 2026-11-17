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
  // 最后更新时间：优先取 Notion 的 "Last Updated" 日期属性，否则用页面的 last_edited_time
  updated?: string;
  content: string;
  author?: string;
  tags?: string[];
  category?: string;
  // locale 用于区分语言 (en | zh)
  locale?: 'en' | 'zh';
}

export async function getDatabaseStructure() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });
  return database;
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s\u4e00-\u9fa5]/g, " ") // 允许中文字符
    .replace(/\s+/g, " ")
    .trim();
  // 对中文做一个近似：如果没有空格且含中文，则按每个中文字符计数
  if (cleanText && /[\u4e00-\u9fa5]/.test(cleanText) && !/\s/.test(cleanText)) {
    return cleanText.length;
  }
  return cleanText ? cleanText.split(" ").length : 0;
}

// 最后更新日期和发布日期不是同一天时才显示
export function isUpdated(post: Post): boolean {
  if (!post.updated) return false;
  return new Date(post.updated).toISOString().slice(0, 10) > new Date(post.date).toISOString().slice(0, 10);
}

// 读取缓存，支持英文与中文两个文件
export function getPostsFromCache(locale: 'en' | 'zh' = 'en'): Post[] {
  const fileName = locale === 'zh' ? 'posts-cache-zh.json' : 'posts-cache.json';
  const cachePath = path.join(process.cwd(), "public", fileName);
  if (fs.existsSync(cachePath)) {
    try {
      const cache = fs.readFileSync(cachePath, "utf-8");
      return JSON.parse(cache);
    } catch (error) {
      console.error(`Error reading posts cache (${fileName}):`, error);
      return [];
    }
  }
  return [];
}

// 支持传入指定的 databaseId (英文/中文)
export async function fetchPublishedPosts(databaseId: string = process.env.NOTION_DATABASE_ID!) {
  const posts = await notion.databases.query({
    database_id: databaseId,
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

// 摘要：优先取 Notion 的 "Description" 文本属性；没有时取正文第一个普通段落
// （跳过标题、引用、列表、表格、图片、代码），去掉 Markdown 标记后截到 160 字
export function getDescription(properties: any, content: string): string {
  const custom = (properties?.Description?.rich_text || [])
    .map((t: any) => t.plain_text)
    .join("")
    .trim();
  if (custom) return custom;

  const firstParagraph =
    content
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 0 && !/^(#|>|[-*+] |\d+\. |\||!\[|```|<)/.test(l)) || "";
  const text = firstParagraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 160 ? text.slice(0, 157).trimEnd() + "..." : text;
}

export async function getPost(slug: string, locale: 'en' | 'zh' = 'en'): Promise<Post | null> {
  const posts = getPostsFromCache(locale);
  return posts.find((p) => p.slug === slug) || null;
}

export async function getPostFromNotion(pageId: string, locale: 'en' | 'zh' = 'en'): Promise<Post | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: pageId })) as PageObjectResponse;
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: contentString } = n2m.toMarkdownString(mdBlocks);

    const properties = (page as any).properties;
    const description = getDescription(properties, contentString);
    let rawTitle = properties.Title?.title?.[0]?.plain_text || "Untitled";
    
    // 优先使用 Notion 中的 Slug 属性
    let slug: string;
    const customSlug = properties.Slug?.rich_text?.[0]?.plain_text || properties.Slug?.title?.[0]?.plain_text || rawTitle;
    
      slug = customSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
      if (!slug) slug = page.id.replace(/-/g, '').slice(0, 12);
    
    console.log(`Generated slug for "${rawTitle}" (locale: ${locale}):`, slug);

    const post: Post = {
      id: page.id,
      title: rawTitle,
      slug,
      coverImage: properties["Featured Image"]?.url || undefined,
      description,
      date: properties["Published Date"]?.date?.start || new Date().toISOString(),
      updated: properties["Last Updated"]?.date?.start || page.last_edited_time,
      content: contentString,
      author: properties.Author?.people?.[0]?.name?.trim() || undefined,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      category: properties.Category?.select?.name,
      locale,
    };
    return post;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}
