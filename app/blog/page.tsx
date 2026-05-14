import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import Section from "@/components/Section";
import { getAllPosts } from "@/lib/posts";

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div>
      <PageTitle
        eyebrow="Writing"
        title="Notes,"
        emphasis="rarely."
        subtitle="When I do write, it lives here. Mostly engineering, sometimes adjacent."
      />
      <ul className="divide-y divide-rule border-y border-rule">
        {posts.map((post, i) => (
          <Section key={post.slug} delay={0.04 * i}>
            <li>
              <Link href={`/blog/${post.slug}`} className="group block py-7 transition-colors hover:bg-card/40">
                <div className="flex items-baseline justify-between gap-4">
                  <time className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
                    {post.date}
                  </time>
                  <span
                    aria-hidden
                    className="font-mono text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-accent-soft"
                  >
                    →
                  </span>
                </div>
                <h3 className="mt-2 text-xl text-ink transition-colors group-hover:text-accent-soft">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-1.5 max-w-xl text-sm text-ink-dim">{post.excerpt}</p>
                )}
              </Link>
            </li>
          </Section>
        ))}
      </ul>
    </div>
  );
}
