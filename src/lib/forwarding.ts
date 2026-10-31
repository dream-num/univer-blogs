export const retiredPosts = [
  {
    slug: "univer-vs-handsontable-a-complete-comparison-of-next-generation-online-spreadsheet-engines",
    date: "2025-08-20",
  },
  {
    slug: "univer-vs-luckysheet-a-comprehensive-comparison-of-open-source-spreadsheet-solutions",
    date: "2025-08-19",
  },
  {
    slug: "univer-vs-spreadjs-comprehensive-analysis-of-the-next-generation-open-source-collaborative-engine-and-traditional-commercial-spreadsheet-controls",
    date: "2025-08-16",
  },
  { slug: "10-best-spreadsheet-components-for-developers-in-2025", date: "2025-08-14" },
] as const;

export function blogDestination(locale: "en" | "zh", slug?: string) {
  return `https://docs.univer.ai/${locale === "zh" ? "zh-CN/" : ""}blog${slug ? `/${slug}` : ""}`;
}

// Run before refresh metadata so query parameters and anchors survive the move.
export const forwardingScript = `{
  const posts=${JSON.stringify(retiredPosts.map((post) => post.slug))};
  const parts=location.pathname.split('/').filter(Boolean);
  const chinese=parts[0]==='zh';
  const offset=chinese?1:0;
  const slug=parts[offset]==='posts'&&parts.length===offset+2&&posts.includes(parts[offset+1])?parts[offset+1]:undefined;
  const target=new URL('https://docs.univer.ai/'+(chinese?'zh-CN/':'')+'blog'+(slug?'/'+slug:''));
  target.search=location.search;
  target.hash=location.hash;
  location.replace(target.href);
}`;
