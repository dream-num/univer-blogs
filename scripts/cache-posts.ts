import { fetchPublishedPosts, getPostFromNotion } from '../src/lib/notion';
import fs from 'fs';
import path from 'path';

async function cachePosts() {
  try {
    console.log('Fetching posts from Notion...');
    const posts = await fetchPublishedPosts();

    const allPosts = [] as any[];

    for (const post of posts) {
      const postDetails = await getPostFromNotion(post.id);
      if (postDetails) {
        allPosts.push(postDetails);
      }
    }

    // 输出到 public 以便静态站点 (GitHub Pages) 直接访问
    const cacheDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const cachePath = path.join(cacheDir, 'posts-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(allPosts, null, 2));

    console.log(`Successfully cached ${allPosts.length} posts to public/posts-cache.json.`);
  } catch (error) {
    console.error('Error caching posts:', error);
    process.exit(1);
  }
}

cachePosts();
