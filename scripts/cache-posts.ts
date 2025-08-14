import { fetchPublishedPosts, getPostFromNotion } from '../src/lib/notion';
import fs from 'fs';
import path from 'path';

async function cacheLocale(databaseId: string, locale: 'en' | 'zh', fileName: string) {
  console.log(`Fetching ${locale} posts from Notion...`);
  const posts = await fetchPublishedPosts(databaseId);
  const allPosts: any[] = [];
  for (const post of posts) {
    const postDetails = await getPostFromNotion(post.id, locale);
    if (postDetails) allPosts.push(postDetails);
  }
  const cacheDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, fileName);
  fs.writeFileSync(cachePath, JSON.stringify(allPosts, null, 2));
  console.log(`✓ Cached ${allPosts.length} ${locale} posts to public/${fileName}`);
}

async function cachePosts() {
  try {
    const enDb = process.env.NOTION_DATABASE_ID!;
    await cacheLocale(enDb, 'en', 'posts-cache.json');

    const zhDb = process.env.NOTION_ZH_DATABASE_ID;
    if (zhDb) {
      await cacheLocale(zhDb, 'zh', 'posts-cache-zh.json');
    } else {
      console.warn('NOTION_ZH_DATABASE_ID not set, skipping zh cache');
    }
  } catch (error) {
    console.error('Error caching posts:', error);
    process.exit(1);
  }
}

cachePosts();
