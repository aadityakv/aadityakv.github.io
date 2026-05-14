import Link from "next/link";
import Avatar from "@/components/Avatar";
import Section from "@/components/Section";

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero — asymmetric: text spans wider column, avatar offset right */}
      <Section className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-12">
        <div className="order-2 sm:order-1">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            Aaditya Venkateswaran
          </p>
          <h1 className="text-[2.75rem] leading-[1.02] tracking-tighter2 text-ink sm:text-[3.5rem]">
            Software engineer,
            <br />
            <span className="font-serif italic text-accent-soft">building at Meta.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-dim">
            Notes, projects, and a résumé. Mostly the work I&apos;m proud of —
            occasionally the work I&apos;m still figuring out.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.18em]">
            <SocialLink
              href="https://github.com/aadityakv"
              label="GitHub"
              handle="@aadityakv"
              icon={<GithubGlyph />}
            />
            <span aria-hidden className="text-ink-faint/50">·</span>
            <SocialLink
              href="https://www.linkedin.com/in/aaditya-k-venkateswaran/"
              label="LinkedIn"
              handle="aaditya-k-venkateswaran"
              icon={<LinkedInGlyph />}
            />
          </div>
        </div>
        <div className="order-1 sm:order-2 sm:pt-2">
          <Avatar size={160} />
        </div>
      </Section>

      <div className="rule" />

      {/* Wayfinding — three numbered entries, varied typography */}
      <Section delay={0.1}>
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            Sections
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            03
          </span>
        </div>
        <ul className="divide-y divide-rule border-y border-rule">
          <NavRow
            num="01"
            href="/portfolio"
            title="Work"
            blurb="Selected projects."
          />
          <NavRow
            num="02"
            href="/blog"
            title="Writing"
            blurb="Notes, rarely. When I do, here."
          />
          <NavRow
            num="03"
            href="/resume"
            title="Résumé"
            blurb="Roles, in order."
          />
        </ul>
      </Section>
    </div>
  );
}

function SocialLink({
  href,
  label,
  handle,
  icon,
}: {
  href: string;
  label: string;
  handle: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-baseline gap-2 text-ink-dim transition-colors hover:text-ink"
    >
      <span className="translate-y-px text-ink-faint group-hover:text-accent-soft">{icon}</span>
      <span>{label}</span>
      <span className="hidden text-ink-faint normal-case tracking-normal sm:inline">
        {handle}
      </span>
    </a>
  );
}

function NavRow({
  num,
  href,
  title,
  blurb,
}: {
  num: string;
  href: string;
  title: string;
  blurb: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-baseline gap-6 py-5 transition-colors hover:bg-card/40"
      >
        <span className="w-10 shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          {num}
        </span>
        <span className="flex-1">
          <span className="text-xl text-ink">{title}</span>
          <span className="ml-3 text-sm text-ink-dim">{blurb}</span>
        </span>
        <span
          aria-hidden
          className="translate-x-0 font-mono text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-accent-soft"
        >
          →
        </span>
      </Link>
    </li>
  );
}

function GithubGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.01-.02-1.99-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedInGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.51C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}
