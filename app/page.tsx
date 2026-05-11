import Link from "next/link";
import Avatar from "@/components/Avatar";
import Section from "@/components/Section";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Section className="flex flex-col items-start gap-10 sm:flex-row sm:items-center">
        <Avatar size={192} />
        <div className="flex-1">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent-glow">
            Hi, I'm
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Aaditya <span className="gradient-text">Venkateswaran</span>
          </h1>
          <p className="mt-4 text-lg text-ink-200">
            Software Engineer at <span className="text-white">Meta</span>.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/aadityakv"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink-100 transition-all hover:bg-white/10 hover:text-white"
            >
              <GithubGlyph />
              github.com/aadityakv
              <span className="opacity-0 transition-opacity group-hover:opacity-100">↗</span>
            </a>
          </div>
        </div>
      </Section>

      <Section delay={0.1} className="grid gap-4 sm:grid-cols-3">
        <NavCard href="/portfolio" title="Portfolio" body="Things I've built." />
        <NavCard href="/blog" title="Blog" body="Things I've written." />
        <NavCard href="/resume" title="Resume" body="Where I've worked." />
      </Section>
    </div>
  );
}

function NavCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group glass relative block overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]"
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-medium text-white">{title}</h3>
        <span className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white">→</span>
      </div>
      <p className="mt-1 text-sm text-ink-300">{body}</p>
    </Link>
  );
}

function GithubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.01-.02-1.99-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  );
}
