import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import Section from "@/components/Section";
import { getAllPosts } from "@/lib/posts";

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div>
      <PageTitle
        eyebrow="Blog"
        title="Writing"
        subtitle="Notes and longer-form pieces. Rare, but earnest."
      />
      <ul className="space-y-3">
        {posts.map((post, i) => (
          <Section key={post.slug} delay={0.04 * i}>
            <li>
              <Link
                href={`/blog/${post.slug}`}
                className="glass group block rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-medium text-white">{post.title}</h3>
                  <time className="shrink-0 font-mono text-xs text-ink-400">{post.date}</time>
                </div>
                {post.excerpt && (
                  <p className="mt-1 text-sm text-ink-300">{post.excerpt}</p>
                )}
              </Link>
            </li>
          </Section>
        ))}
      </ul>
    </div>
  );
}
