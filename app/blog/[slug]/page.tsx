import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <article className="prose prose-invert max-w-none">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 font-mono text-xs text-ink-400 hover:text-white"
      >
        ← back to writing
      </Link>
      <header className="mt-6 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        <time className="mt-2 block font-mono text-xs text-ink-400">{post.date}</time>
      </header>
      <div
        className="post-body space-y-5 text-ink-200 leading-relaxed [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-white [&_a]:text-accent-glow [&_a]:underline [&_a]:decoration-accent/40 [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/60 [&_blockquote]:pl-4 [&_blockquote]:text-ink-300 [&_blockquote]:italic [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-ink-950/80 [&_pre]:p-4 [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
