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
    <article>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink"
      >
        ← Writing
      </Link>
      <header className="mt-8 mb-12">
        <time className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          {post.date}
        </time>
        <h1 className="mt-3 text-[2.25rem] leading-[1.1] tracking-tighter2 text-ink sm:text-[2.75rem]">
          {post.title}
        </h1>
      </header>
      <div
        className="post-body space-y-5 text-[17px] leading-[1.75] text-ink/90
          [&_h2]:font-serif [&_h2]:italic [&_h2]:text-[1.5rem] [&_h2]:tracking-tightish [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-3
          [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-ink
          [&_a]:text-accent-soft [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-2 hover:[&_a]:text-accent
          [&_strong]:text-ink
          [&_em]:font-serif [&_em]:italic
          [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-1.5
          [&_ul_li]:relative [&_ul_li]:pl-5
          [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-[0.65em] [&_ul_li]:before:h-px [&_ul_li]:before:w-3 [&_ul_li]:before:bg-accent/70
          [&_blockquote]:border-l [&_blockquote]:border-accent/60 [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:italic [&_blockquote]:text-ink-dim
          [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:bg-card [&_code]:border [&_code]:border-rule [&_code]:px-1.5 [&_code]:py-0.5
          [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-rule [&_pre]:bg-card [&_pre]:p-4 [&_pre]:text-sm
          [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
