export default function BlogForward({
  target,
  chinese = false,
}: {
  target: string;
  chinese?: boolean;
}) {
  return (
    <main lang={chinese ? "zh-CN" : "en"} className="mx-auto max-w-2xl px-6 py-16">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <h1 className="mb-4 text-2xl font-semibold">
        {chinese ? "Univer 博客已迁移" : "The Univer blog has moved"}
      </h1>
      <a className="underline" href={target}>
        {chinese ? "继续阅读" : "Continue reading"}
      </a>
    </main>
  );
}
